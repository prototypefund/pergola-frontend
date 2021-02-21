import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import {
  EventNote as EventNoteIcon,
  Map as MapIcon,
  Opacity as WaterdropIcon,
} from '@material-ui/icons'
import {useKeycloak} from '@react-keycloak/web'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Home() {
  const { t } = useTranslation()
  const { keycloak } = useKeycloak()
  const classes = useStyles()

  return (
    <Container>
      <Paper elevation={0} className={classes.paperContainer}>
        <Typography variant="h4">{t( 'gardeningTogether' )}</Typography>
        <List>
          <ListItem className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <WaterdropIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Erstelle einen Gießplan für euren Garten" />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <EventNoteIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Verschaffe dir einen Überblick über anstehende Termine" />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <MapIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Lerne mit der interaktiven Karte deinen Garten kennen" />
          </ListItem>
        </List>
        {!keycloak.authenticated && <Button onClick={() => keycloak.login()} variant="contained" color="primary" className={classes.button}>
            anmelden</Button>}
      </Paper>
    </Container>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  paperContainer: {
    margin: '3rem 0 1rem 0',
    padding: '1rem',
  },
  listItem: {
    padding: '.5rem 0'
  },
  listItemIcon: {
    minWidth: '2.5rem',
  },
  button: {
    margin: '.5rem 0',
    '& + &': {
      marginLeft: '.5rem'
    }
  }
} ))
