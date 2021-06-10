import { Map as LeafletMap } from 'leaflet'
import { Map as ReactLeafletMap } from 'react-leaflet'

export type MapRef = React.MutableRefObject<
  ReactLeafletMap<any, LeafletMap> | undefined
>;
