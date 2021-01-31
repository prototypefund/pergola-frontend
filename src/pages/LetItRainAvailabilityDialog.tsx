import {gql, useQuery} from '@apollo/client'
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

import {Calendar} from '../components'
import {fromNeo4JDate, toNeo4JDate} from '../helper'
import {RootState} from '../reducers'
import {_Neo4jDate,WateringPeriod} from '../types/graphql'

const GET_WATERING_PERIOD = gql`
    query WateringPeriod($date: _Neo4jDateInput) {
        WateringPeriod( filter:
        { AND: [
            { from_lte: $date },
            { till_gte: $date } ]
        }) {
            from { day month year }
            till { day month year }
            wateringtasks( filter: {
                users_available_some: { label: "$label" }
            }) {
                date { day month year }
                users_available { label }
            }
        }
    }
`
interface Props {
  startDate: Date
}

export function LetItRainAvailabilityDialog( {startDate} : Props ) {
  const classes = useStyles()
  const theme = useTheme()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )
  const [availableDates, setAvailableDates] = useState<Array<Date>>( [] )
  const {data: wateringPeriodData} = useQuery<{WateringPeriod: WateringPeriod[]}, { date: _Neo4jDate, label: string}>( GET_WATERING_PERIOD, {
    variables: {
      date: toNeo4JDate( startDate ),
      label: userProfile?.username || ''
    }
  } )
  const tasks =  wateringPeriodData?.WateringPeriod?.[0]?.wateringtasks || []
  const { from, till } = wateringPeriodData?.WateringPeriod?.[0] || {}
  const calendarDates =  ( from && till && [...Array( Math.abs( dayjs( fromNeo4JDate( till )).diff( fromNeo4JDate( from ), 'day' )))]
    .map(( _, i ) =>  dayjs( fromNeo4JDate( from )) .add( i, 'day' ).toDate())) || []

  useEffect(() => {
    const _availableDates = tasks.map( t => t ? fromNeo4JDate( t.date ) : new Date())
    setAvailableDates( _availableDates )
  }, [tasks] )




  const handleCancel = () => false
  const handleOkay = () => false

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
          onClick={() => handleCancel()}
        >
          abbrechen
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.dialogActionButton}
          onClick={() => handleOkay()}
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
