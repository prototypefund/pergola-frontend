import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import {
  EventNote as EventNoteIcon,
  Map as MapIcon,
  Opacity as WaterdropIcon,
} from '@material-ui/icons'
import { useKeycloak } from '@react-keycloak/web'
import { KeycloakProfile } from 'keycloak-js'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../reducers'

export function LoginFeatures() {
  const { t } = useTranslation()
  const { keycloak } = useKeycloak()
  const classes = useStyles()
  const userProfile = useSelector<RootState, KeycloakProfile | null>(
    ( { userProfile } ) => userProfile
  )

  return !keycloak.authenticated ? (
    <>
      <Box mt={2} mb={1} textAlign="center">
        <Button
          onClick={() => keycloak.login()}
          variant="contained"
          color="primary"
          className={classes.button}
          fullWidth={true}
        >
          Melde dich an
        </Button>
      </Box>
      <List>
        <ListItem className={classes.listItem}>
          <ListItemIcon className={classes.listItemIcon}>
            <WaterdropIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Hilf mit und trage dich den gemeinsamen Gießplan ein" />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemIcon className={classes.listItemIcon}>
            <EventNoteIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Erfahre wann Aktionen und Workshops stattfinden" />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemIcon className={classes.listItemIcon}>
            <MapIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Lerne in einer interaktiven Karte deinen Garten kennen" />
        </ListItem>
      </List>
    </>
  ) : (
    <>
      <Box my={2}>
        <Typography variant="h4" gutterBottom>
          Hallo {userProfile?.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Demnächst erfährst du hier Neues über deinen Garten.
        </Typography>
        <Typography>
          Du kannst dich bis dahin auf der Karte, im Gießpan oder dem Kalender
          umschauen.
        </Typography>
      </Box>
    </>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  button: {
    color: theme.palette.primary.contrastText,
  },
  listItem: {},
  listItemIcon: {
    minWidth: '2.5rem',
  },
} ))
