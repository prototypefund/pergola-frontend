import { Box, Button, Container, Paper, Typography } from '@material-ui/core'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import { useKeycloak } from '@react-keycloak/web'
import AvatarComponent from 'avataaars'
import { KeycloakProfile } from 'keycloak-js'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setUserProfile } from '../actions'
import { LoginPrompt } from '../components/LoginPrompt'
import { getAvatarPropsForUser } from '../helper'
import { RootState } from '../reducers'

export function Settings() {
  const { t } = useTranslation()
  const { keycloak } = useKeycloak()
  const dispatch = useDispatch()
  const userProfile = useSelector<RootState, KeycloakProfile | null>(
    ( { userProfile } ) => userProfile
  )

  return keycloak.authenticated ? (
    <Container maxWidth="xs">
      <Box m={2} p={2} textAlign="center" clone>
        <Paper elevation={0}>
          <Box mt={2} mb={4} textAlign="center">
            <AvatarComponent
              style={{ width: '150px', height: '150px' }}
              {...getAvatarPropsForUser( keycloak.subject || '' )}
            />
            <Typography>{userProfile?.username}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ExitToAppRoundedIcon />}
            onClick={() => {
              keycloak.logout()
              dispatch( setUserProfile( null ))
            }}
          >
            {t( 'user.logout' )}
          </Button>
        </Paper>
      </Box>
    </Container>
  ) : (
    <LoginPrompt />
  )
}
