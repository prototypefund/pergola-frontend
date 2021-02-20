import {KeycloakProfile} from 'keycloak-js'
import { createSelectorHook } from 'react-redux'
import { combineReducers } from 'redux'

import { gardenMap, GardenMapStateType } from './gardenMap'
import {letItRain, LetItRainStateType} from './letItRain'
import { userProfile } from './userProfile'

export interface RootState {
  userProfile: null|KeycloakProfile
  letItRain: LetItRainStateType
  gardenMap: GardenMapStateType
}

//We pass over the history object because some reducer might need it

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reducers = () => combineReducers( {userProfile, letItRain, gardenMap} )

export const useSelector = createSelectorHook<RootState>()

export default reducers
