import * as React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useSelector } from 'react-redux'
import { RootState } from '../reducers'
import {KeycloakProfile} from 'keycloak-js'
import { useDispatch } from 'react-redux'
import {setUserProfile} from '../actions'

export function Login() {
  const { keycloak } = useKeycloak()
  const userProfile = useSelector<RootState>(({userProfile}) => userProfile)
  const dispatch = useDispatch()

  return keycloak.authenticated ?
  (
    <a onClick={() => { keycloak.logout()
	                dispatch(setUserProfile(null))
                      }}>
      <div>
        {userProfile && (userProfile as KeycloakProfile).username}
	&nbsp;
        Logout
      </div>
    </a>
  ) :
  (
    <a onClick={() => keycloak.login()}>
      <div>
        Login
      </div>
    </a>
  )
}
