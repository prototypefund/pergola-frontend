import './css/icons.css'
import './css/app.scss'
import 'leaflet/dist/leaflet.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ReduxRoot } from './ReduxRoot'

const rootEl = document.getElementById( 'app' )
console.log( 'rootel' )
ReactDOM.render( <ReduxRoot />, rootEl )
