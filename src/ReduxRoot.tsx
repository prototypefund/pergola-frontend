import { ApolloClient, ApolloProvider, createHttpLink,InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Typography } from '@material-ui/core'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import Keycloak from 'keycloak-js'
import * as React from 'react'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import {setUserProfile} from './actions'
import App from './App'
import configureStore from './configureStore'

dayjs.extend( localizedFormat )
dayjs.extend( weekday )

//import {key} from 'localforage';

const keycloak = Keycloak( {
  realm: 'keycloak-connect-graphql', // process.env.REACT_APP_KEYCLOAK_REALM,
  url: 'http://localhost:8080/auth/', // process.env.REACT_APP_KEYCLOAK_URL,
  clientId: 'keycloak-connect-graphql-public' // process.env.REACT_APP_KEYCLOAK_CLIENT_ID
} )

const uri =
  process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:4001/graphql'
const cache = new InMemoryCache()

function ApolloRoot( {persistor} ) {
  const { keycloak } = useKeycloak()
  const authLink = setContext(( _, { headers } ) => {
    return {
      headers: {
        ...headers,
        authorization: keycloak.token ? `Bearer ${keycloak.token}` : '',
      }
    }
  } )
  const client = new ApolloClient( {
    link: authLink.concat( createHttpLink( {uri} )),
    cache,
  } )

  return (
    <ApolloProvider client={client}>
      <PersistGate
        loading={<Typography>Loading...</Typography>}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </ApolloProvider>
  )
}

export function KeycloakRoot( {persistor} ) {
  const dispatch = useDispatch()

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={event => {
        if( event === 'onAuthSuccess' ) {
	  keycloak.loadUserProfile()
            .then( function( profile ) {
	            dispatch( setUserProfile( profile ))
            } )
        }
      }}>
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
