import React, { useEffect, useState } from 'react'

const OSMBuildingsMap = () => {
  const style = {
    width: '100%',
    height: '500px',
    backgroundColor: '#000000',
  }
  const [map, setMap] = useState( null )

  useEffect(() => {
    console.log( 'Heyyy' )
    // @ts-ignore
    if ( typeof window.OSMBuildings === 'function' ) {
      console.log( 'Heyyyy' )
      // @ts-ignore
      const osmb = new window.OSMBuildings( {
        container: 'mapContainer',
        position: { latitude: 52.51836, longitude: 13.40438 },
        zoom: 16,
        minZoom: 15,
        maxZoom: 20,
        attribution:
          '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © Map <a href="https://mapbox.com/">Mapbox</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>',
      } )
      setMap( osmb )
      osmb.addMapTiles(
        'https://api.mapbox.com/styles/v1/osmbuildings/cjt9gq35s09051fo7urho3m0f/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib3NtYnVpbGRpbmdzIiwiYSI6IjNldU0tNDAifQ.c5EU_3V8b87xO24tuWil0w',
        {
          attribution:
            '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> · © Map <a href="https://mapbox.com/">Mapbox</a>',
        }
      )

      osmb.addGeoJSONTiles(
        'https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json'
      )
    }
  }, [] )

  return (
    <div>
      <div id="mapContainer" className="map osmbuilding" style={style} />
    </div>
  )
}

export default OSMBuildingsMap
