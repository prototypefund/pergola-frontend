import { gql, useMutation, useQuery } from '@apollo/client'
import {Box, Button, Input, makeStyles, Paper, TextField, Theme, Toolbar, Typography} from '@material-ui/core'
import MDEditor from '@uiw/react-md-editor'
import _ from 'lodash'
import {filter, isNil } from 'rambda'
import * as React from 'react'
import { useCallback, useEffect ,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {GardenLocationSearchMap} from '../components/settings'
import {fromNeo4jPointToLatLng} from '../helper/neo4jpoint'
import {_Neo4jPoint, GardenSettings, GardenSettingsInput} from '../types/graphql'

const validUrl = ( url ) => {
  try {
    new URL( url )
    return true
    // eslint-disable-next-line no-empty
  } catch ( _ ) {}
  return false
}



const GET_GARDENSETTINGS = gql`  
  query GardenSettings($gardenId: ID!) {
      GardenSettings(filter: {garden: {gardenId: $gardenId}}) {
          name
          shortDescription
          infoPageMarkdown
          logoUrl
          homepageUrl
          location { latitude longitude }
      }
  }
`

const MERGE_GARDENSETTINGS_OF_GARDEN = gql`  
  mutation mergeGardenSettings($settings: GardenSettingsInput) {
      mergeGardenSettings(settings: $settings)
      # TODO fix Garden settings to return the settings
      #{
      #    name
      #    shortDescription
      #    infoPageMarkdown
      #    logoUrl
      #    homepageUrl
      #    location { latitude longitude }
      #}
  }
`

export function GardenSettingsPage() {
  const classes = useStyles()
  const { t } = useTranslation()

  const { gardenId } = useParams<{gardenId: string}>()
  const [gardenName, setGardenName] = useState<string | null | undefined>( undefined )
  const [gardenShortDesc, setGardenShortDesc] = useState<string | null | undefined>( undefined )
  const [gardenInfoPage, setGardenInfoPage] = useState<string | null | undefined>( undefined )
  const [gardenLogo, setGardenLogo] = useState<string | null | undefined>( undefined )
  const [gardenHomepage, setGardenHompage] = useState<string | null | undefined>( undefined )
  const [gardenLocation, setGardenLocation] = useState<_Neo4jPoint | null | undefined>( undefined )

  const validLogoUrl = validUrl( gardenLogo )
  const validHomepageUrl = validUrl( gardenHomepage )

  const updateGardenLocation = useCallback(
    ( lat: number, lng: number ) => {
      setGardenLocation( {latitude: lat,longitude: lng} )
    },
    [setGardenLocation] )

  const [mergeGardenSettingsOfGarden] =
    useMutation< GardenSettings, {settings: GardenSettingsInput}>( MERGE_GARDENSETTINGS_OF_GARDEN, {
      variables: {settings: {
        gardenId,
        ...filter( prop => !isNil( prop ), {
          name: gardenName,
          shortDescription: gardenShortDesc,
          infoPageMarkdown: gardenInfoPage,
          homepageUrl: validHomepageUrl ? gardenHomepage : undefined,
          logoUrl: validLogoUrl ? gardenLogo : undefined,
          location: gardenLocation ? gardenLocation : undefined
        } )
      }}} )

  const saveGardenSettings = useCallback(
    async () => {
      const result = await mergeGardenSettingsOfGarden()
      console.log( result )
    },
    [mergeGardenSettingsOfGarden]
  )


  const {data: gardenSettingsData} = useQuery<{ GardenSettings: GardenSettings[]}, {gardenId: string}>(
    GET_GARDENSETTINGS, {
      variables: { gardenId }} )

  useEffect(() => {
    return () => {
      if( gardenSettingsData?.GardenSettings?.[0] ) {
        const {
          name,
          shortDescription,
          infoPageMarkdown,
          logoUrl,
          homepageUrl,
          location
        } = gardenSettingsData.GardenSettings[0]
        console.log( {name, shortDescription} )
        setGardenName( name )
        setGardenShortDesc( shortDescription )
        setGardenInfoPage( infoPageMarkdown )
        setGardenLogo( logoUrl )
        setGardenHompage( homepageUrl )
        if( location ) {
          const { latitude, longitude } = location
          _.isNumber( latitude )  && _.isNumber( longitude )  && setGardenLocation( location )
        }
      }
    }
  }, [gardenSettingsData] )


  return (
    <div>
      <Paper className={classes.formPaper}>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h4'>{t( 'settings' ).title}</Typography>
          <div>
            <Button color='primary' onClick={saveGardenSettings}>{t( 'save' )}</Button>
          </div>
        </Toolbar>
        <form className={classes.form}>
          <TextField
            id='garden-name'
            label={t( 'settings' ).gardenName}
            value={gardenName || ''}
            onChange={e => setGardenName( e.target.value )}
          />
          <TextField
            id='garden-short-desc'
            multiline
            rowsMax={3}
            label={t( 'settings' ).gardenShortDesc}
            value={gardenShortDesc || ''}
            onChange={e => setGardenShortDesc( e.target.value )}
          />
          <TextField
            id='garden-homepage'
            error={!!( gardenHomepage && !validHomepageUrl )}
            label={t( 'settings' ).gardenHomepage}
            value={gardenHomepage || ''}
            onChange={e => setGardenHompage( e.target.value )}
          />
          <div id='garden-info-page' style={{width: '100%'}}>
            <MDEditor style={{background: 'none'}}  value={gardenInfoPage || ''} onChange={v => setGardenInfoPage( v || '' )} />
          </div>
          <div className='logoDiv'>
            <TextField
              style={{flexGrow: 1}}
              error={!!( gardenLogo && !validLogoUrl )}
              id='garden-logo'
              label={t( 'settings' ).gardenLogo}
              value={gardenLogo || ''}
              onChange={e => setGardenLogo( e.target.value )}
              helperText={t( 'settings' ).gardenLogoHelp}
            />
            {gardenLogo && validLogoUrl && <img alt='Logo' src={gardenLogo} className='logoAvatar'/>}
          </div>
          <div>
            <GardenLocationSearchMap
              markerPosition={gardenLocation && fromNeo4jPointToLatLng( gardenLocation ) || undefined}
              onChangeMarkerPosition={updateGardenLocation}
            />
          </div>

        </form>
      </Paper>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  formPaper: {
    padding: theme.spacing( 1 ),
    margin: theme.spacing( 2 ),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& .logoDiv': {
      display: 'flex',
      flexDirection: 'row',
      '& >  .logoAvatar': {
        height: '2rem',
        margin: theme.spacing( 2 )
      }
    }
  },
  toolbar: {
    justifyContent: 'space-between'
  }
} ))
