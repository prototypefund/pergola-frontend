import _ from 'lodash'

import {_Neo4jPoint, _Neo4jPointInput} from '../types/graphql'

interface LatLng {
  lat: number;
  lng: number;
}

export const toNeo4jPointInput: ( latLng: LatLng ) => _Neo4jPointInput = ( {lat, lng} ) => ( {
  longitude: lng,
  latitude: lat
} )

export const fromNeo4jPointToLatLng: ( point: _Neo4jPoint ) => LatLng | undefined = ( {latitude, longitude} ) =>  {
  return _.isNumber( latitude )  && _.isNumber( longitude )  && { lat: latitude, lng: longitude} || undefined
}
