import { Box, Button, Typography } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/web'
import {KeycloakProfile} from 'keycloak-js'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch,useSelector  } from 'react-redux'

import {setUserProfile} from '../actions'
import { RootState } from '../reducers'

export function Login() {
  const { t } = useTranslation()
  const { keycloak } = useKeycloak()
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )
  const dispatch = useDispatch()

  return keycloak.authenticated ?
    ( <Box textAlign="center">
        <Button onClick={() => { keycloak.logout()
                    dispatch( setUserProfile( null ))
        }}>
          {t( 'user.logout' )}
        </Button>
        <Typography>
            &nbsp;
          {userProfile?.username}
        </Typography>
      </Box>
    ) :
    (
      <Button onClick={() => keycloak.login()}>
        {t( 'user.login' )}
      </Button>
    )
}
