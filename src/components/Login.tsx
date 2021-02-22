import {Box, Button, Typography} from '@material-ui/core'
import {useKeycloak} from '@react-keycloak/web'
import AvatarComponent from 'avataaars'
import {KeycloakProfile} from 'keycloak-js'
import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'

import {setUserProfile} from '../actions'
import {getAvatarPropsForUser} from '../helper'
import {RootState} from '../reducers'

export function Login() {
  const {t} = useTranslation()
  const {keycloak} = useKeycloak()
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )
  const dispatch = useDispatch()

  return keycloak.authenticated ?
    (
      <Box display='flex' flexDirection='row' alignItems='center'>
        <Box textAlign="center">
          <Button onClick={() => {
            keycloak.logout()
            dispatch( setUserProfile( null ))
          }}>
            {t( 'user.logout' )}
          </Button>
          <Typography>
            &nbsp;
            {userProfile?.username}
          </Typography>
        </Box>
        <AvatarComponent
          style={{width: '50px', height: '50px'}}
          {...getAvatarPropsForUser( keycloak.subject || '' )}
        />
      </Box>
    ) :
    (
      <Button onClick={() => keycloak.login()}>
        {t( 'user.login' )}
      </Button>
    )
}
