import { Box, Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/web'
import AvatarComponent from 'avataaars'
import { KeycloakProfile } from 'keycloak-js'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import { setUserProfile } from '../actions'
import { getAvatarPropsForUser } from '../helper'
import { RootState } from '../reducers'

export function Login() {
  const { t } = useTranslation()
  const { keycloak } = useKeycloak()
  const { url } = useRouteMatch()
  const userProfile = useSelector<RootState, KeycloakProfile | null>(
    ( { userProfile } ) => userProfile
  )
  const classes = useStyles()

  return keycloak.authenticated ? (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box textAlign="center">
        <Button
          className={classes.button}
          href={url + '/settings'}
          title={userProfile?.username}
        >
          <AvatarComponent
            style={{ width: '50px', height: '50px' }}
            {...getAvatarPropsForUser( keycloak.subject || '' )}
          />
        </Button>
      </Box>
    </Box>
  ) : (
    <Button className={classes.button} onClick={() => keycloak.login()}>
      {t( 'user.login' )}
    </Button>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  button: {
    color: theme.palette.primary.contrastText,
  },
} ))
