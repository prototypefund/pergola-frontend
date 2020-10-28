import 'leaflet-pixi-overlay/L.PixiOverlay'

import { Layer } from 'leaflet'
import * as PIXI from 'pixi.js'
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
