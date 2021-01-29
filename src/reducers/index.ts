import {KeycloakProfile} from 'keycloak-js'
import { combineReducers } from 'redux'

import {letItRain, LetItRainStateType} from './letItRain'
import { userProfile } from './userProfile'

export interface RootState {
  userProfile: null|KeycloakProfile
  letItRain: LetItRainStateType
}

//We pass over the history object because some reducer might need it

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reducers = () => combineReducers( {userProfile, letItRain} )

export default reducers
