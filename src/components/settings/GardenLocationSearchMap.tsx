import '../leaflet/preleaflet'
import 'leaflet.icon.glyph/Leaflet.Icon.Glyph'
import '@icon/icofont/icofont.css'

import {makeStyles, Theme} from '@material-ui/core'
import * as L from 'leaflet'
import * as React from 'react'
import {useCallback,useRef, useState } from 'react'
import {LayersControl, Map, Marker, Popup, TileLayer, withLeaflet} from 'react-leaflet'

import {MapRef} from '../leaflet/types'
import {LocationSearchField} from './LocationSearchField'

export function GardenLocationSearchMap() {
  const classes = useStyles()

  const mapRef: MapRef = useRef()
  const [zoom, setZoom] = useState<number>( 17 )
  const [position, setPosition] = useState<L.LatLngExpression>( {
    lat: 51.0833,
    lng: 13.73126,
  } )
  const [gardenPosition, setGardenPosition] = useState<L.LatLngExpression>( {
    lat: 51.0833,
    lng: 13.73126,
  } )
  const showGardenMarker = true

  const updateLocation  = useCallback(
    ( lat: number, lng: number ) => {
      setPosition( {lat, lng} )
      setGardenPosition( {lat, lng} )
      setZoom( 17 )
    },
    [setPosition, setGardenPosition, setZoom]
  )

  const onMapClicked = useCallback(
    ( event: L.LeafletMouseEvent ) => {
      setGardenPosition( event.latlng )
    },
    [setGardenPosition]
  )

  // @ts-ignore
  const farmerIcon = L.icon.glyph( {
    prefix: 'icofont',
    glyph: 'icofont-farmer',
    glyphSize: '18px',

  } )

  return (
    <div>
      <LocationSearchField onLocationFound={updateLocation} />
      <Map
        mapRef={mapRef}
        className={classes.map}
        style={{
          minHeight: '400px',
          height: '100%',
          width: '100%',
        }}
        center={position}
        zoom={zoom}
        maxZoom={24}
        onclick={onMapClicked}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap.default">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={18}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Arcgis Satelite">
            <TileLayer
              attribution='&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community '
              url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={20}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {showGardenMarker && <Marker position={gardenPosition} icon={farmerIcon}>
          <Popup>
            Your Garden
          </Popup>
        </Marker>}
      </Map>
    </div>
  )
}

const useStyles = makeStyles(() => ( {
  map: {
    '& .leaflet-tile-container img': {
      width: '257px !important',
      height: '257px !important'
    }
  }
} ))
