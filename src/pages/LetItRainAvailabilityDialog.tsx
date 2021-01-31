import {gql, useMutation, useQuery} from '@apollo/client'
import {
  Box, Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  useMediaQuery, useTheme
} from '@material-ui/core'
import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { useHistory } from 'react-router-dom'

import {Calendar} from '../components'
import {fromNeo4jDate, neo4jDateToInput,toNeo4jDateInput} from '../helper'
import {RootState} from '../reducers'
import {_Neo4jDateInput, WateringPeriod} from '../types/graphql'

const GET_WATERING_PERIOD = gql`
    query WateringPeriod($date: _Neo4jDateInput, $label: String) {
        WateringPeriod( filter:
        { AND: [
            { from_lte: $date },
            { till_gte: $date } ]
        }) {
            from { day month year }
            till { day month year }
            wateringtasks( filter: {
                users_available_some: { label: $label }
            }) {
                date { day month year }
                users_available { label }
            }
        }
    }
`

const SET_USER_AVAILABLITY_FOR_WATERING_PERIOD = gql`
    mutation  setUserAvailability($dates: [_Neo4jDateInput]!, $from: _Neo4jDateInput, $till: _Neo4jDateInput) {
        setUserAvailability(
            dates: $dates
            from: $from
            till: $till
        )
    }
`
interface Props {
  startDate: Date
}

export function LetItRainAvailabilityDialog( {startDate } : Props ) {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )
  const [availableDates, setAvailableDates] = useState<Array<Date>>( [] )
  const {data: wateringPeriodData} = useQuery<{WateringPeriod: WateringPeriod[]}, { date: _Neo4jDateInput, label: string}>( GET_WATERING_PERIOD, {
    variables: {
      date: toNeo4jDateInput( startDate ),
      label: userProfile?.username || ''
    }
  } )
  const tasks =  wateringPeriodData?.WateringPeriod?.[0]?.wateringtasks || []
  const { from, till } = wateringPeriodData?.WateringPeriod?.[0] || {}
  const calendarDates =  ( from && till && [...Array( Math.abs( dayjs( fromNeo4jDate( till )).diff( fromNeo4jDate( from ), 'day' )))]
    .map(( _, i ) =>  dayjs( fromNeo4jDate( from )) .add( i, 'day' ).toDate())) || []
  const [setUserAvailabilityMutation] =
    useMutation< Boolean, { dates: Array<_Neo4jDateInput>, from: _Neo4jDateInput | undefined, till: _Neo4jDateInput | undefined }>(
      SET_USER_AVAILABLITY_FOR_WATERING_PERIOD,
      {variables: {
        dates: availableDates.map( toNeo4jDateInput ),
        from: from && neo4jDateToInput( from ),
        till: till && neo4jDateToInput( till )
      }} )

  useEffect(() => {
    const _availableDates = tasks.map( t => t ? fromNeo4jDate( t.date ) : new Date())
    setAvailableDates( _availableDates )
  }, [tasks] )




  const handleCancel = () => history.goBack()
  const handleOkay = async () => {
    await setUserAvailabilityMutation()
    history.goBack()
  }

  return (

    <Dialog
      fullScreen={fullscreenDialog}
      className={classes.dialog + ( fullscreenDialog ? '' : ' noFullscreen' )}
      open={true}
    >
      <DialogTitle className={classes.dialogTitle} />
      <DialogContent className={classes.dialogContent}>
        <Box display="flex" flexDirection="column" flexWrap="wrap" alignItems="center" justifyContent="space-between" className={classes.box} >
          {calendarDates.length > 0 && <Calendar
            dates={calendarDates}
            selectedDates={availableDates}
            onChange={( dates ) => {
              setAvailableDates( dates )
            }}/>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          className={classes.dialogActionButton}
          onClick={handleCancel}
        >
          abbrechen
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.dialogActionButton}
          onClick={handleOkay}
        >
            Okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  dialog: {
    '&.noFullscreen .MuiDialog-paper': {
      minHeight: '800px',
      minWidth: '700px',
    },
  },
  dialogTitle: {
    '& h2': {
      display: 'flex',
      alignItems: 'center',
    },
    '& span': {
      position: 'relative',
      margin: '0 auto',
      left: '-20px',
    },
  },
  dialogContent: {
    position: 'relative'
  },
  dialogActionButton: {
    padding: '1rem',
    borderRadius: 0,
  },
  box: {
    height: '75%',
    maxHeight: '450px',
  }
} ))
