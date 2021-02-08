import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import dayjs from 'dayjs'
import de from 'dayjs/locale/de'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import Keycloak from 'keycloak-js'
import * as React from 'react'
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
const cache = new InMemoryCache()

function ApolloRoot( { persistor } ) {
  const { keycloak } = useKeycloak()
  const authLink = setContext(( _, { headers } ) => {
    return {
      headers: {
        ...headers,
        authorization: keycloak.token ? `Bearer ${keycloak.token}` : '',
      },
    }
  } )
  const client = new ApolloClient( {
    link: authLink.concat( createHttpLink( { uri } )),
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

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={( event ) => {
        if ( event === 'onAuthSuccess' ) {
          keycloak.loadUserProfile().then( function ( profile ) {
            dispatch( setUserProfile( profile ))
          } )
        }
      }}
    >
      <ApolloRoot persistor={persistor} />
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
