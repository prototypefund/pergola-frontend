import {
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
import { Eco } from '@material-ui/icons'
import {useKeycloak} from '@react-keycloak/web'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'


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
  const { keycloak } = useKeycloak()
  const classes = useStyles()
  const [selectedGarden, setSelectedGarden] = useState( '' )

  const handleSelectGarden = ( event ) => {
    setSelectedGarden( event.target.value )
  }

  const gardens: LandingPage_Garden[] = [
    { id: 'wurzelwerk', name: 'Wurzelwerk' },
    { id: 'johannstadt', name: 'Internationaler Garten Johannstadt' },
  ]
  const landingInfos: LandingPage_Info[] = [
    { id: '0', headline: 'Erstelle einen Gießplan für euren Garten' },
    { id: '1', headline: 'Verschaffe dir einen Überblick über anstehende Termine' },
    { id: '2', headline: 'Lerne mit der interaktiven Karte deinen Garten kennen' },
  ]

  return (
    <div>
      <Container className={classes.gardenSelectContainer}>
        <FormControl variant="filled" fullWidth={true}>
          <InputLabel>Wähle einen Garten</InputLabel>
          <Select value={selectedGarden} onChange={handleSelectGarden}>
            <MenuItem key="none" value="">
              <em>keiner</em>
            </MenuItem>
            {gardens.map(( { id, name } ) => (
              <MenuItem key={id} value={id}>
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
            {landingInfos.map(( { id, headline } ) => (
              <ListItem className={classes.listItem} key={id}>
                <ListItemIcon className={classes.listItemIcon}>
                  <Eco color="primary" />
                </ListItemIcon>
                <ListItemText primary={headline} />
              </ListItem>
            ))}
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
