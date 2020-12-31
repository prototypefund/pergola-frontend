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
import { FilterVintage } from '@material-ui/icons'
import React, { useState } from 'react'

import BackgroundImage from '../static/background_full_grey_01.jpg'

export interface LandingPage_Garden {
  id: string;
  name: string;
}

export interface LandingPage_Info {
  id: string;
  headline: string;
}

export function LandingPage() {
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
    { id: '0', headline: 'Gießpläne können erstellt werden' },
    { id: '1', headline: 'COVID-19 Restriktionen' },
    { id: '2', headline: 'weitere Gartenmitgleider hinzugekommen' },
  ]

  return (
    <div className={classes.page}>
      <Container className={classes.titleAndChooser}>
        <Typography variant="h2">Pergola</Typography>
        <Typography variant="h5">Gemeinsam Gärtnern</Typography>
      </Container>
      <Container className={classes.gardenSelectContainer}>
        <FormControl variant="filled" className={classes.gardenSelectControl}>
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
          <Typography>Gemeinsam gärtnern mit Pergola</Typography>
          <List>
            {landingInfos.map(( { id, headline } ) => (
              <ListItem key={id}>
                <ListItemIcon>
                  <FilterVintage />
                </ListItemIcon>
                <ListItemText primary={headline} />
              </ListItem>
            ))}
          </List>
          <Container>
            <Button variant="contained">mehr erfahren</Button>
            <Button variant="contained" color="primary">
              anmelden
            </Button>
          </Container>
          <Typography>Neuen Gemeinschaftsgarten registrieren?</Typography>
        </Paper>
      </Container>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  page: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'fixed',
    height: '100%'
  },
  gardenSelectContainer: {
    marginTop: '23px',
    marginBottom: '28px',
  },
  paperContainer: {
    padding: '25px 27px 10px 27px',
  },
  gardenSelectControl: {
    width: '100%',
  },
  titleAndChooser: {
    color: theme.palette.primary.contrastText,
  },
} ))
