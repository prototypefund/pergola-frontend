// @ts-nocheck
import './leaflet/preleaflet'
import 'leaflet.icon.glyph/Leaflet.Icon.Glyph'
import '@icon/icofont/icofont.css'

import {makeStyles} from '@material-ui/core'
import * as L from 'leaflet'
import * as React from 'react'
import {useState} from 'react'
import {LayersControl, Map, Marker, Popup, TileLayer, withLeaflet} from 'react-leaflet'

import LeafletEditableOverlay from './leaflet/LeafletEditableOverlay'

const WrappedEditableOverlay = withLeaflet( LeafletEditableOverlay )

export function GardenMap() {
  const classes = useStyles()
  const [zoom] = useState<number>( 17 )
  const [position] = useState<L.Leaflet.LatLngExpression>( {
    lat: 51.0833,
    lng: 13.73126,
  } )

  const showGardenMarker = false

  const drawCallback = () => {
    return
  }
  const data = []


  const fancyI2 = L.icon.glyph( {
    prefix: 'icofont',
    glyph: 'icofont-broccoli',
    glyphSize: '18px',

  } )

  function whenMapReady() {
    setInterval(() => {
      try {
        this.invalidateSize()
      } catch ( e ) {
        console.warn( 'cannot invalidate sizes' )
      }
    }, 1000 )
  }

  return (
    <Map
      className={classes.map}
      whenReady={whenMapReady}
      style={{
        minHeight: '400px',
        height: '100%',
        width: '100%',
      }}
      center={position}
      zoom={zoom}
      maxZoom={24}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Stamen">
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png"
            maxNativeZoom={16}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Arcgis Satelite">
          <TileLayer
            attribution='&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community '
            url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap.default">
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={18}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Stamen Terrain">
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png"
            maxNativeZoom={14}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carto Light">
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxNativeZoom={18}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <WrappedEditableOverlay
        key="editable-overlay"
      />
      {showGardenMarker && <Marker position={position} icon={fancyI2}>
        <Popup>
          Your Garden
        </Popup>
      </Marker>}
    </Map>
  ) as JSX.Element
}


const useStyles = makeStyles(( theme ) => ( {
  map: {
    '& .leaflet-tile-container img': {
      width: '257px !important',
      height: '257px !important'
    }
  }
} ))
