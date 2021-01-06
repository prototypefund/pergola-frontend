import { useKeycloak } from '@react-keycloak/web'
import {KeycloakProfile} from 'keycloak-js'
import * as React from 'react'
import { useDispatch,useSelector  } from 'react-redux'

import {setUserProfile} from '../actions'
import { RootState } from '../reducers'

export function Login() {
  const { keycloak } = useKeycloak()
  const userProfile = useSelector<RootState>(( {userProfile} ) => userProfile )
  const dispatch = useDispatch()

  return keycloak.authenticated ?
    (
      <a onClick={() => { keycloak.logout()
	                dispatch( setUserProfile( null ))
      }}>
        <div>
          {userProfile && ( userProfile as KeycloakProfile ).username}
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
