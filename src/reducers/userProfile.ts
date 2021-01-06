import {KeycloakProfile} from 'keycloak-js'

import {UserProfileAction,UserProfileActions} from '../actions/userProfile'
import createReducer from './createReducer'

export const userProfile = createReducer<null|KeycloakProfile>( null, {
  [UserProfileActions.SET_USER_PROFILE]( state: null|KeycloakProfile, action: UserProfileAction ) {
    return action.payload
  }
} )
