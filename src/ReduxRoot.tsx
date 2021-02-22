import './i18n'

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  from,   InMemoryCache,
  split
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import {Backdrop, CircularProgress } from '@material-ui/core'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import { WebSocketLink } from 'apollo-link-ws'
import dayjs from 'dayjs'
import de from 'dayjs/locale/de'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import Keycloak from 'keycloak-js'
import * as React from 'react'
import { useState } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { setUserProfile } from './actions'
import App from './App'
import configureStore from './configureStore'
import logo from './static/logo-pergola-green.svg'

dayjs.extend( localizedFormat )
dayjs.extend( weekday )
// TODO: time locale according to browser or user settings
dayjs.locale( { ...de, weekStart: 1 } )

//import {key} from 'localforage';

const keycloak = Keycloak( {
  realm: process.env.REACT_APP_KEYCLOAK_REALM || 'keycloak-connect-graphql',
  url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080/auth/',
  clientId:
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID ||
    'keycloak-connect-graphql-public',
} )

const uri = process.env.PERGOLA_API_URL || 'http://localhost:4001/graphql'
const wsUri = uri.replace( /^http(s?)/, 'ws$1' )
const cache = new InMemoryCache()


function getHeaders( keycloak: Keycloak.KeycloakInstance ) {
  return {
    authorization: keycloak.token ? `Bearer ${keycloak.token}` : '',
  }
}

function ApolloRoot( { persistor } ) {
  const { keycloak } = useKeycloak()

  const wsLink = new WebSocketLink( {
    uri: wsUri,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => ( {
        headers: getHeaders( keycloak ),
      } ),
    },
  } ) as unknown as ApolloLink

  const authLink = setContext(( _, { headers } ) => {
    return {
      headers: {
        ...headers,
        ...getHeaders( keycloak )
      },
    }
  } )

  const httpLink = createHttpLink( {uri} )

  const client = new ApolloClient( {
    link: from( [
      split(
        ( { query } ) => {
          const def = getMainDefinition( query )
          return def.kind === 'OperationDefinition' && def.operation === 'subscription'
        },
        wsLink,
        authLink.concat( httpLink )
      )
    ] ),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      }
    }
  } )

  return (
    <ApolloProvider client={client}>
      <PersistGate
        loading={<img src={logo} alt="Loading..." style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} />}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </ApolloProvider>
  )
}

export function KeycloakRoot( { persistor } ) {
  const dispatch = useDispatch()
  const [keyCloakReady, setKeyCloakReady] = useState( false )

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={( event ) => {
        if ( event === 'onReady' ) {
          setKeyCloakReady( true )
        }
        if ( event === 'onAuthSuccess' ) {
          keycloak.loadUserProfile().then( function ( profile ) {
            dispatch( setUserProfile( profile ))
          } )
        }
      }}
    >
      {
        keyCloakReady
          ? <ApolloRoot persistor={persistor} />
          : <Backdrop open> <CircularProgress color='inherit' /></Backdrop>
      }
    </ReactKeycloakProvider>
  )
}

export function ReduxRoot() {
  const { persistor, store } = configureStore()

  return (
    <Provider store={store}>
      <KeycloakRoot persistor={persistor} />
    </Provider>
  )
}
