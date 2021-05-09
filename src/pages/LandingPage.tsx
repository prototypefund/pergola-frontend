import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  Typography,
} from '@material-ui/core'
import { useKeycloak } from '@react-keycloak/web'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { LoginFeatures } from '../components/LoginFeatures'
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
  console.log( { url } )
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
        <Box textAlign="center" my={2}>
          <svg className={classes.title} role="img">
            <title>Pergola</title>
            <use
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xlinkHref={title + '#logo'}
            />
          </svg>
        </Box>
      </Container>
      <Container maxWidth="sm">
        <Paper elevation={0} className={classes.paperContainer}>
          <Typography variant="h4" gutterBottom={true}>
            {t( 'gardeningTogether' )}
          </Typography>
          <Typography variant="body1" gutterBottom={true}>
            Organisiere dich in deinen Gemeinschaftgarten – für mehr Zeit
            zusammen im Grünen.
          </Typography>
        </Paper>
        <Paper elevation={0} className={classes.paperContainer}>
          <Box mb={2} textAlign="center">
            <FormControl variant="filled" fullWidth={true}>
              <InputLabel>Erkunde einen Garten</InputLabel>
              <Select value={selectedGarden} onChange={handleSelectGarden}>
                <MenuItem key="none" value="">
                  <em>Erkunde&hellip;</em>
                </MenuItem>
                {gardens.map(( { id, name } ) => (
                  <MenuItem key={id} component={Link} to={`${url}${id}/home`}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {!keycloak.authenticated && (
            <>
              <Typography align="center" gutterBottom={true}>
                oder
              </Typography>
              <LoginFeatures />
            </>
          )}
          <Box mt={1} mb={1} textAlign="center">
            <Button
              variant="contained"
              className={classes.button}
              href="https://community-garden.github.io/"
              target="_blank"
            >
              Mehr Infos zum Projekt
            </Button>
          </Box>
        </Paper>
        <Box textAlign="center" my={2} />
      </Container>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  title: {
    width: '200px',
    maxWidth: '50vw',
    height: '87px',
    fill: theme.palette.primary.contrastText,
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
  listItem: {},
  listItemIcon: {
    minWidth: '2.5rem',
  },
  button: {
    [theme.breakpoints.up( 'sm' )]: {
      width: 'auto',
    },
    '& + &': {
      marginLeft: '.5rem',
    },
  },
} ))
