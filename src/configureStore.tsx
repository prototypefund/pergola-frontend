import { createBrowserHistory } from 'history'
import * as localforage from 'localforage'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

//whenever we need to store something on the device for Pergola
const persistConfig: PersistConfig<any> = {
  key: 'root',
  version: 1,
  storage: localforage,
  blacklist: ['letItRain'],
}

const history = createBrowserHistory()

let middleware = applyMiddleware( thunk )

const dev = process.env.NODE_ENV === 'development'
if ( dev ) {
  //nice for debugging global state management
  const logger = ( createLogger as any )()
  middleware = composeWithDevTools( applyMiddleware( thunk, logger ))
}

const persistedReducer = persistReducer( persistConfig, rootReducer())

export default () => {
  const store = createStore( persistedReducer, {}, middleware ) as any
  const persistor = persistStore( store )
  return { store, persistor }
}

export { history }
