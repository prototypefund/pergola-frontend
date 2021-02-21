import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Select,
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
import { Link, useRouteMatch } from 'react-router-dom'

import title from '../static/logo-pergola-title.svg'


export interface LandingPage_Garden {
  id: string;
  name: string;
}

export interface LandingPage_Info {
  id: string;
  headline: string;
}

export function LandingPage() {
  const { t } = useTranslation()
  const { url } = useRouteMatch()
  console.log( {url} )
  const { keycloak } = useKeycloak()
  const classes = useStyles()
  const [selectedGarden, setSelectedGarden] = useState( '' )

  const handleSelectGarden = ( event ) => {
    setSelectedGarden( event.target.value )
  }

  const gardens: LandingPage_Garden[] = [
    { id: 'wurzelwerk', name: 'Wurzelwerk' },
    { id: 'pippilotta', name: 'Garten Pippilotta' },
  ]

  return (
    <div>
      <Container>
        <Box textAlign="center">
          <svg className={classes.title} role="img">
            <title>Pergola</title>
            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={title + '#logo'} />
          </svg>
        </Box>
        <FormControl variant="filled" fullWidth={true}>
          <InputLabel>Wähle einen Garten</InputLabel>
          <Select value={selectedGarden} onChange={handleSelectGarden}>
            <MenuItem key="none" value="">
              <em>keiner</em>
            </MenuItem>
            {gardens.map(( { id, name } ) => (
              <MenuItem key={id} component={Link}  to={`${url}${id}/home`} >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>
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
          <Button variant="contained" className={classes.button} href="https://community-garden.github.io/" target="_blank">Mehr Infos</Button>
          {!keycloak.authenticated && <Button onClick={() => keycloak.login()} variant="contained" color="primary" className={classes.button}>
            anmelden</Button>}
        </Paper>
      </Container>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  title: {
    width: '200px',
    maxWidth: '50vw',
    height: 'auto',
    fill: theme.palette.primary.contrastText
  },
  gardenSelectContainer: {
    marginTop: '23px',
    marginBottom: '28px',
  },
  paperContainer: {
    margin: '1rem 0',
    padding: '1rem',
  },
  titleAndChooser: {
    color: theme.palette.primary.contrastText,
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
