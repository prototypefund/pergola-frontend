import 'leaflet-pixi-overlay/L.PixiOverlay'
import 'leaflet-draw/dist/leaflet.draw-src.css'
import 'leaflet-draw/dist/leaflet.draw-src'

import { Layer } from 'leaflet'
import * as PIXI from 'pixi.js'
import React from 'react'
import { MapLayer, MapLayerProps } from 'react-leaflet'

interface ReactLeaflet_PixiOverlayProps extends MapLayerProps {
  data: object;
  drawCallback: ( utils: object, data: object ) => any;
}

export default class ReactLeaflet_PixiOverlay
  extends MapLayer
  implements JSX.Element {
  createLeafletElement( props: ReactLeaflet_PixiOverlayProps ) {
    const { data, drawCallback } = props
    // @ts-ignore
    return L.pixiOverlay( function ( utils ) {
      drawCallback( utils, data )
    }, new PIXI.Container()) as Layer
  }

  componentDidMount() {
    const { layerContainer, map } = this.props.leaflet || this.context
    this.leafletElement.addTo( layerContainer )
    this.leafletElement.addTo( map )

    // @ts-ignore
    const editableLayer = new L.FeatureGroup()
    map.addLayer( editableLayer )
    // @ts-ignore
    const drawControl = new L.Control.Draw( {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 10,
          },
        },
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!', // Message that will show when intersect
          },
          shapeOptions: {
            color: '#bada55',
          },
        },
        circle: false, // Turns off this drawing tool
        rectangle: {
          shapeOptions: {
            clickable: false,
          },
        },
      },
      edit: {
        featureGroup: editableLayer, //REQUIRED!!
        remove: false,
      },
    } )
    map.addControl( drawControl )
    // @ts-ignore
    map.on( L.Draw.Event.CREATED, ( e ) => {
      const type = e.layerType,
        layer = e.layer

      if ( type === 'marker' ) {
        layer.bindPopup( 'A popup!' )
      }

      editableLayer.addLayer( layer )
    } )
  }

  componentWillUnmount() {
    console.log( this.context )
    const { layerContainer, map } = this.props.leaflet || this.context
    map.removeLayer( this.leafletElement )
    layerContainer.removeLayer( this.leafletElement )
  }

  componentDidUpdate() {
    this.componentWillUnmount()
    this.leafletElement = this.createLeafletElement( this.props )
    this.componentDidMount()
  }

  key: React.Key | null = null;
  props: any;
  type: any;
}
