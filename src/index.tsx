import './css/icons.css'
import 'leaflet/dist/leaflet.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ReduxRoot } from './ReduxRoot'

const rootEl = document.getElementById( 'app' )
ReactDOM.render( <ReduxRoot />, rootEl )
