import './preleaflet'
import './leaflet.extra-markers'

import {gql, useMutation, useQuery} from '@apollo/client'
import * as L from 'leaflet'
import {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import {SelectShape} from '../../actions'
import {toNeo4jDateInput} from '../../helper'
import {toNeo4jPointInput} from '../../helper/neo4jpoint'
import {
  GardenLayer,
  MarkerShape, MutationAddGeoShapeBelongs_ToArgs, MutationAddMarkerShapeBelongs_ToArgs,
  MutationCreateGardenLayerArgs,
  MutationCreateMarkerShapeArgs, MutationCreatePolygonShapeArgs, MutationMergeGardenLayerAtArgs,
  MutationUpdateMarkerShapeArgs, MutationUpdatePolygonShapeArgs, PolygonShape
} from '../../types/graphql'


const CREATE_MARKER_SHAPE_MUTATION = gql`
    mutation CreateMarkerShape($icon: String!, $point: _Neo4jPointInput!) {
        CreateMarkerShape(icon: $icon, point: $point, points: [ $point ] ) {
            shapeId
        }
    }
`
const CREATE_POLYGON_SHAPE_MUTATION = gql`
    mutation CreatePolygonShape($startPoint: _Neo4jPointInput!, $points: [_Neo4jPointInput]!) {
        CreatePolygonShape(startPoint: $startPoint, points: $points) {
            shapeId
        }
    }
`
const CREATE_LAYER_GROUP_MUTATION = gql`
    mutation CreateGardenLayer( $name: String!, $date: _Neo4jDateInput) {
        CreateGardenLayer( name: $name, date: $date) {
            layerId
        }
    }
`
const ADD_GARDEN_LAYER_AT_GARDEN_MUTATION = gql`
mutation AddGardenLayerAt($from: _GardenLayerInput!, $to:  _GardenInput!) {
    AddGardenLayerAt(from: $from, to: $to) {
        from { layerId }
        to { gardenId }
    }
}
`

const ADD_GEO_SHAPE_BELONGS_TO_GARDEN_MUTATION = gql`
    mutation AddGeoShapeBelongs_To($from: _GeoShapeInput!, $to:  _GardenLayerInput!) {
        AddGeoShapeBelongs_to(from: $from, to: $to) {
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
const UPDATE_POLYGON_SHAPE_MUTATION = gql`
    mutation UpdateMarkerShape($shapeId: ID!, $startPoint: _Neo4jPointInput, $points: [_Neo4jPointInput]) {
        UpdatePolygonShape(shapeId: $shapeId, startPoint: $startPoint, points: $points) {
            shapeId
        }
    }
`

const GET_GARDEN_LAYER_QUERY = gql`
    query GardenLayer($gardenId: ID!) {
        GardenLayer(filter: {at: {gardenId: $gardenId}}) {
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
        feature {
            featureType
            plants
        }
    }
}`
const GET_POLYGON_SHAPE_QUERY = gql`query  PolygonShape($layerId: ID!) {
    PolygonShape(filter: {belongs_to: {layerId: $layerId}}) {
        shapeId
        points { latitude longitude }
        feature {
            featureType
            plants
        }
    }
}`

interface ShapeCreatorProps {
  map?: L.Evented;
  editableLayer?: L.FeatureGroup;
}

export function ShapeCreator( {map, editableLayer}: ShapeCreatorProps ) {

  const dispatch = useDispatch()
  const [layerId, setLayerId] = useState<string | undefined>()
  const {gardenId} = useParams<{ gardenId: string }>()
  const [createMarkerShape] = useMutation<{ CreateMarkerShape: { shapeId: string } }, MutationCreateMarkerShapeArgs>( CREATE_MARKER_SHAPE_MUTATION )
  const [createPolygonShape] = useMutation<{ CreatePolygonShape: { shapeId: string } }, MutationCreatePolygonShapeArgs>( CREATE_POLYGON_SHAPE_MUTATION )
  const [updateMarkerShape] = useMutation<{ UpdateMarkerShape: { shapeId: string } }, MutationUpdateMarkerShapeArgs>( UPDATE_MARKER_SHAPE_MUTATION )
  const [updatePolygonShape] = useMutation<{ UpdatePolygonShape: { shapeId: string } }, MutationUpdatePolygonShapeArgs>( UPDATE_POLYGON_SHAPE_MUTATION )
  const [createLayerGroup] = useMutation<{ CreateGardenLayer: {layerId: string } }, MutationCreateGardenLayerArgs>( CREATE_LAYER_GROUP_MUTATION )
  //const [markerShapeBelongsToLayer] = useMutation<{ AddMarkerShapeBelongs_To: { from: { shapeId: string }, to: { layerId: string } } }, MutationAddMarkerShapeBelongs_ToArgs>( ADD_MARKER_SHAPE_BELONGS_TO_GARDEN_MUTATION )
  const [geoShapeBelongsToLayer] = useMutation<{ AddGeoShapeBelongsToLayer: { from: { shapeId: string }, to: { layerId: string } } }, MutationAddGeoShapeBelongs_ToArgs>( ADD_GEO_SHAPE_BELONGS_TO_GARDEN_MUTATION )
  const [gardenLayerIsAtGarde] = useMutation<{ AddGardenLayerAt: { from: { layerId: string }, to: { gardenId: string } } }, MutationMergeGardenLayerAtArgs >( ADD_GARDEN_LAYER_AT_GARDEN_MUTATION )
  const {data: GardenLayerData, loading} = useQuery<{GardenLayer: GardenLayer[]}, {gardenId: string}>( GET_GARDEN_LAYER_QUERY, {
    variables: {
      gardenId
    }
  } )
  const {data: markerShapeData, loading: shapesLoading} =  useQuery<{MarkerShape: MarkerShape[]}, {layerId: string}>( GET_MARKER_SHAPE_QUERY, {
    variables: {
      layerId: layerId || ''
    }} ) || {}
  const {data: polygonShapeData, loading: polygonsLoading} =  useQuery<{PolygonShape: PolygonShape[]}, {layerId: string}>( GET_POLYGON_SHAPE_QUERY, {
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
        const layerId = layerGroupData?.CreateGardenLayer.layerId
        if( layerId ) {
          const { data: layerToGardenData } = await gardenLayerIsAtGarde( {
            variables: {
              from: { layerId },
              to: { gardenId }
            }
          } )
          layerToGardenData && setLayerId( layerId )
        }
      }
      _createLayer()
    } else {
      setLayerId( _layerId )
    }
  }, [GardenLayerData, loading] )

  /*useEffect(() => {
    const t = setInterval(() => { try { markerShapeData && !shapesLoading && refetch() } catch( e ) {
      console.error( e )} }, 5000 )
    return () => {
      clearInterval( t )
    }
  }, [] )*/



  const createShape = async ( layerType: string, layer: any,_layerId?: string ) => {
    if( !_layerId ) return
    let shapeId
    if( layerType === 'polygon' ) {
      const latLngs = layer.getLatLngs()[0]
      if( !Array.isArray( latLngs )) return
      const  {data: markerData } = await createPolygonShape( {variables: {
        startPoint: toNeo4jPointInput( latLngs[0] ),
        points: latLngs.map( toNeo4jPointInput ),
      }} )
      shapeId = markerData?.CreatePolygonShape.shapeId
    }
    if ( layerType === 'marker' ) {
      // layer.bindPopup( 'A popup!' )
      const {data: markerData} = await createMarkerShape( {
        variables: {
          point: toNeo4jPointInput( layer.getLatLng()),
          points: [],
          icon: JSON.stringify( layer.getIcon().options ),
        }
      } )
      shapeId = markerData?.CreateMarkerShape.shapeId
    }

    if( !shapeId ) return
    await geoShapeBelongsToLayer( {variables: {
      from: {  shapeId },
      to: { layerId: _layerId  }
    }} )
    layer.on( 'click', () => dispatch( SelectShape( shapeId )))
    layer._shapeId = shapeId
    editableLayer?.addLayer( layer )

  }
  const updateShape = async ( shapeId: string, layerType: string, layer: any ) => {
    let _shapeId
    if ( layerType === 'marker' ) {
      const  {data: markerData } = await updateMarkerShape( {variables: {
        shapeId,
        point: toNeo4jPointInput( layer.getLatLng()),
        points: [],
        icon: JSON.stringify( layer.getIcon().options ),
      }} )
      _shapeId = markerData?.UpdateMarkerShape.shapeId
    }
    if( layerType === 'polygon' ) {
      console.log( {layer} )
      const latLngs = layer.getLatLngs()[0]
      //if( !Array.isArray( latLngs )) return
      const {data: polygonData } = await updatePolygonShape( {variables: {
        shapeId,
        startPoint: toNeo4jPointInput( latLngs[0] ),
        points: latLngs.map( toNeo4jPointInput )
      }} )
      _shapeId = polygonData?.UpdatePolygonShape.shapeId
    }
    console.log( `updated ${_shapeId}` )
  }


  const markerMap = new Map<string, L.Marker>()
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
  const poliMap = new Map<string, L.Polygon>()
  const createOrUpdatePolygon = ( id: string, latLngs?: L.LatLngExpression[] , options?: L.PolylineOptions ) => {
    let polygon
    if( poliMap.has( id )) {
      polygon = poliMap.get( id )
      polygon.addLatLng( latLngs )
      //polygon

    } else {
      if( !latLngs ) return
      polygon = L.polygon( latLngs, options )
      polygon.on( 'click', () => dispatch( SelectShape( id )))
      poliMap.set( id, polygon )
      console.log( 'create polygon' )
    }

    polygon._shapeId = id
    editableLayer && !editableLayer.hasLayer( polygon ) &&  polygon.addTo( editableLayer )
  }

  useEffect(() => {
    if( !map || ! editableLayer ) return
    editableLayer.clearLayers()
    if( markerShapeData ) {
      for ( const shape of markerShapeData.MarkerShape ) {
        const {latitude, longitude} = shape.point || {}
        const plant = shape.feature?.plants?.[0]
        const markerOptions = plant
          ? {...JSON.parse( shape.icon ), icon: 'icofont icofont-' + shape.feature?.plants?.[0]}
          : JSON.parse( shape.icon )
        latitude && longitude && createOrUpdateMarker(
          shape.shapeId,
          [latitude, longitude],
          markerOptions as L.MarkerOptions )
      }
    }
    if( polygonShapeData ) {
      for ( const shape of polygonShapeData.PolygonShape ) {
        const latLngs = shape.points || []
        //const plant =  shape.feature?.plants?.[0]
        const options = {}
        latLngs && createOrUpdatePolygon(
          shape.shapeId,
          latLngs?.map( p => p && p.latitude && p.longitude ? [p.latitude, p.longitude] : [0, 0] ),
          options as L.PolylineOptions )
      }
    }

  }, [polygonShapeData, markerShapeData, map] )


  useEffect(() => {
    if( !map || !layerId ) return
    // @ts-ignore
    map.on( L.Draw.Event.EDITED, ( e ) => {
      // @ts-ignore
      e?.layers?.eachLayer( l => {
        const shapeId = l._shapeId
        updateShape( shapeId, l.getLatLngs ? 'polygon' : 'marker', l ).catch( err => {
          console.error( 'cannot update shape', err )
        } )
      } )
    } )
    // @ts-ignore
    map.on( L.Draw.Event.CREATED, ( e ) => {
      // @ts-ignore
      const type = e.layerType

      const {
        layer
      } = e
      console.log( 'create!!', {type, layer} )

      if ( type === 'marker' || type === 'polygon' ) {
        //layer.bindPopup( 'A popup!' )
        createShape( type, layer, layerId ).catch( err => {
          console.error( 'cannot save shape', err )
        } )
      }
    } )
  }, [map, layerId] )


  return null
}

