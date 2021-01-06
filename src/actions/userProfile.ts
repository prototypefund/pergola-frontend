import {KeycloakProfile} from 'keycloak-js'

export enum UserProfileActions {
	SET_USER_PROFILE = 'SET_USER_PROFILE'
}

interface UserProfileActionType<T,P> {
	type: T;
	payload: P;
}

export type UserProfileAction =
	UserProfileActionType<typeof UserProfileActions.SET_USER_PROFILE, KeycloakProfile | null>

export function setUserProfile( profile: null|KeycloakProfile ): UserProfileAction {
  return {type: UserProfileActions.SET_USER_PROFILE,
    payload: profile}
}
