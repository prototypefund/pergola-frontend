// @ts-nocheck
import Leaflet from 'leaflet'
import * as React from 'react'
import { useState } from 'react'
import { Map, Marker, Popup, TileLayer, withLeaflet } from 'react-leaflet'

import ReactLeaflet_PixiOverlay from './LeafletPixiOverlay'

const WrappedPixiOverlay = withLeaflet( ReactLeaflet_PixiOverlay )

export function GardenMap() {
  const [zoom] = useState<number>( 18 )
  const [position] = useState<Leaflet.LatLngExpression>( {
    lat: 51.0833,
    lng: 13.73126,
  } )

  const drawCallback = () => {
    return
  }
  const data = []

  function whenMapReady() {
    setInterval(() => {
      this.invalidateSize()
    }, 1000 )
  }

  return (
    <Map
      whenReady={whenMapReady}
      style={{
        minHeight: '400px',
        height: '100%',
        width: '100%',
      }}
      center={position}
      zoom={zoom}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <WrappedPixiOverlay
        key="pixi-overlay"
        data={data}
        drawCallback={drawCallback}
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </Map>
  ) as JSX.Element
}
