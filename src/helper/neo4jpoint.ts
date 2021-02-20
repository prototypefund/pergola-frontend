import {_Neo4jPointInput} from '../types/graphql'

interface LatLng {
  lat: number;
  lng: number;
}

export const toNeo4jPointInput: ( latLng: LatLng ) => _Neo4jPointInput = ( {lat, lng} ) => ( {
  longitude: lng,
  latitude: lat
} )
