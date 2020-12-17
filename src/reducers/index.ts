import { History } from 'history'
import {KeycloakProfile} from 'keycloak-js'
import { combineReducers } from 'redux'

import { userProfile } from './userProfile'

export interface RootState {
  userProfile: null|KeycloakProfile
}

//We pass over the history object because some reducer might need it

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reducers = ( history: History ) => combineReducers( {userProfile} )

export default reducers
