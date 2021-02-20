import './preleaflet'
import './leaflet.extra-markers'

import {gql, useMutation, useQuery} from '@apollo/client'
import * as L from 'leaflet'
import * as React from 'react'
import {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'

import {SelectShape} from '../../actions'
import {toNeo4jDateInput} from '../../helper'
import {toNeo4jPointInput} from '../../helper/neo4jpoint'
import {
  GardenLayer,
  MarkerShape,
  MutationCreateGardenLayerArgs,
  MutationCreateMarkerShapeArgs,
  MutationMergeMarkerShapeBelongs_ToArgs, MutationUpdateMarkerShapeArgs
} from '../../types/graphql'


const CREATE_MARKER_SHAPE_MUTATION = gql`
    mutation CreateMarkerShape($icon: String!, $point: _Neo4jPointInput!) {
        CreateMarkerShape(icon: $icon, point: $point, points: [ $point ] ) {
            shapeId
        }
    }
`
const CREATE_LAYER_GROUP_MUTATION = gql`
    mutation CreateGardenLayer($name: String!, $date: _Neo4jDateInput) {
        CreateGardenLayer(name: $name, date: $date) {
            layerId
        }
    }
`
const MERGE_MARKER_SHAPE_MUTATION = gql`
    mutation AddMarkerShapeBelongs_To($from: _MarkerShapeInput!, $to:  _GardenLayerInput!) {
        AddMarkerShapeBelongs_to(from: $from, to: $to) {
            from { shapeId }
            to { layerId }
        }
    }
`
const UPDATE_MARKER_SHAPE_MUTATION = gql`
    mutation UpdateMarkerShape($shapeId: ID!, $icon: String, $point: _Neo4jPointInput) {
        UpdateMarkerShape(shapeId: $shapeId, icon: $icon, point: $point, points: [ $point ]) {
            shapeId
        }
    }
`

const GET_GARDEN_LAYER_QUERY = gql`
    query GardenLayer {
        GardenLayer {
            layerId,
            name,
        }
    }
`

const GET_MARKER_SHAPE_QUERY = gql`query  MarkerShape($layerId: ID!) {
    MarkerShape(filter: {belongs_to: {layerId: $layerId}}) {
        shapeId
        point { latitude longitude }
        icon
    }
}`

interface ShapeCreatorProps {
  map?: L.Evented;
  editableLayer?: L.FeatureGroup;
}

export function ShapeCreator( {map, editableLayer}: ShapeCreatorProps ) {

  const dispatch = useDispatch()
  const [layerId, setLayerId] = useState<string | undefined>()
  const [createMarkerShape] = useMutation<{ CreateMarkerShape: { shapeId: string } }, MutationCreateMarkerShapeArgs>( CREATE_MARKER_SHAPE_MUTATION )
  const [updateMarkerShape] = useMutation<{ UpdateMarkerShape: { shapeId: string } }, MutationUpdateMarkerShapeArgs>( UPDATE_MARKER_SHAPE_MUTATION )
  const [createLayerGroup] = useMutation<{ CreateGardenLayer: {layerId: string } }, MutationCreateGardenLayerArgs>( CREATE_LAYER_GROUP_MUTATION )
  const [mergeMarkerShape] = useMutation<{ mergeMarkerShape: { from: { shapeId: string }, to: { layerId: string } } }, MutationMergeMarkerShapeBelongs_ToArgs>( MERGE_MARKER_SHAPE_MUTATION )
  const {data: GardenLayerData, loading} = useQuery<{GardenLayer: GardenLayer[]}>( GET_GARDEN_LAYER_QUERY )
  const {data: markerShapeData} =  useQuery<{MarkerShape: MarkerShape[]}, {layerId: string}>( GET_MARKER_SHAPE_QUERY, {
    variables: {
      layerId: layerId || ''
    }} ) || {}

  useEffect(() => {
    if( loading ) return
    const _layerId = GardenLayerData?.GardenLayer?.[0]?.layerId
    if ( !_layerId ) {
      const _createLayer = async () => {
        const {data: layerGroupData} = await createLayerGroup( {
          variables: {
            name: 'Beete',
            date: toNeo4jDateInput( new Date())
          }
        } )
        setLayerId( layerGroupData?.CreateGardenLayer.layerId )
      }
      _createLayer()
    } else {
      setLayerId( _layerId )
    }
  }, [GardenLayerData, loading] )
  console.log( {layerId} )


  const createShape = async ( layerType: string, layer: any,_layerId?: string ) => {
    if( !_layerId ) return
    if ( layerType === 'marker' ) {
      // layer.bindPopup( 'A popup!' )
      const  {data: markerData } = await createMarkerShape( {variables: {
        point: toNeo4jPointInput( layer.getLatLng()),
        points: [],
        icon: JSON.stringify( layer.getIcon().options ),
      }} )
      const shapeId = markerData?.CreateMarkerShape.shapeId
      shapeId && await mergeMarkerShape( {variables: {
        from: {  shapeId },
        to: { layerId: _layerId  }
      }} )
      layer._shapeId = shapeId
      editableLayer?.addLayer( layer )

    }
  }
  const updateShape = async ( shapeId: string, layerType: string, layer: any ) => {
    if ( layerType === 'marker' ) {
      const  {data: markerData } = await updateMarkerShape( {variables: {
        shapeId,
        point: toNeo4jPointInput( layer.getLatLng()),
        points: [],
        icon: JSON.stringify( layer.getIcon().options ),
      }} )
      const _shapeId = markerData?.UpdateMarkerShape.shapeId
      console.log( `updated ${_shapeId}` )

    }

  }


  const markerMap = new Map<string, L.Marker>()
  //const markerToShapeID = ( marker: L.Marker ) => Array.from( markerMap.entries())
  //  .find(( [, _m] ) => marker === _m )?.[0]

  const createOrUpdateMarker = ( id: string, latLng?: L.LatLngExpression , options?: L.MarkerOptions ) => {
    let marker
    if( markerMap.has( id )) {
      marker = markerMap.get( id )
      // @ts-ignore
      options && marker.setIcon( new L.ExtraMarkers.icon( options ))
      latLng && marker.setLatLng( latLng )

    } else {
      if( !latLng || !options )  return
      // @ts-ignore
      const _markerIcon = new L.ExtraMarkers.icon( options )
      marker = L.marker( latLng, {icon: _markerIcon} )
      marker.on( 'click', () => dispatch( SelectShape( id )))
      markerMap.set( id, marker )
    }
    marker._shapeId = id
    editableLayer && !editableLayer.hasLayer( marker ) &&  marker.addTo( editableLayer )
  }

  useEffect(() => {
    if( !map || ! editableLayer || !markerShapeData ) return
    for( const shape of markerShapeData.MarkerShape ) {
      const {latitude, longitude} = shape.point || {}
      latitude && longitude && createOrUpdateMarker( shape.shapeId, [latitude, longitude], JSON.parse( shape.icon ) as L.MarkerOptions )
    }

  }, [markerShapeData, map] )

  useEffect(() => {
    if( !map ) return
    // @ts-ignore
    map.on( L.Draw.Event.EDITED, ( e ) => {
      // @ts-ignore
      e?.layers?.eachLayer( l => {
        const shapeId = l._shapeId
        updateShape( shapeId, 'marker', l ).catch( err => {
          console.error( 'cannot update shape', err )
        } )
        console.log( l )
      } )
    } )
    // @ts-ignore
    map.on( L.Draw.Event.CREATED, ( e ) => {
      // @ts-ignore
      const type = e.layerType

      const {
        layer
      } = e

      if ( type === 'marker' ) {
        layer.bindPopup( 'A popup!' )
        createShape( type, layer, layerId ).catch( err => {
          console.error( 'cannot save shape', err )
        } )
      }

    } )
  }, [map] )


  return null
}

