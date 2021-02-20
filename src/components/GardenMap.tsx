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
  const [zoom] = useState<number>( 18 )
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
        <LayersControl.BaseLayer checked name="Arcgis Satelite">
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
