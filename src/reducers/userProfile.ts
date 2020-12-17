import {KeycloakProfile} from "keycloak-js"
import createReducer from "./createReducer"
import {UserProfileActions, UserProfileAction} from "../actions/userProfile"

export const userProfile = createReducer<null|KeycloakProfile>(null, {
	[UserProfileActions.SET_USER_PROFILE](state: null|KeycloakProfile, action: UserProfileAction) {
		return action.payload
	}
})
