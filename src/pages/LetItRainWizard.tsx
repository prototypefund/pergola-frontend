import {gql, useMutation} from '@apollo/client'
import {Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Toolbar, Typography, useMediaQuery, useTheme} from '@material-ui/core'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'

import { Calendar, HorizontalStepper, LetItRainFrequency } from '../components'
import {_Neo4jDateInput, UserSettings, UserSettingsInput} from '../types/graphql'

export interface LetItRainWizardRouterProps {
  stepNumber: string;
}

interface StepDesc {
  title: String;
  headline: String;
  StepComponent: JSX.Element;
}

const DAYS_COUNT = 14

const SET_USER_AVAILABLITY_FOR_WATERING_PERIOD = gql`
mutation  setUserAvailability($dates: [_Neo4jDateInput]!) { 
  setUserAvailability(
    dates: $dates
  )
}
`

const MERGE_USER_SETTINGS = gql`
mutation mergeUserSettings($settings: UserSettingsInput!) {
    mergeUserSettings (
        settings: $settings
    ) { letitrain_maximum_tasks }
}
`

export function LetItRainWizard() {
  const theme = useTheme()
  const classes = useStyles()
  const history = useHistory()
  const { stepNumber } = useParams<LetItRainWizardRouterProps>()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))
  const [availableDates, setAvailableDates] = useState<Array<Date>>( [] )
  const [userWantsMaximumTasks, setUserWantsMaximumTasks] = useState( 1 )

  const [setUserAvailabilityMutation] =
      useMutation<Boolean, { dates: Array<_Neo4jDateInput> }>( SET_USER_AVAILABLITY_FOR_WATERING_PERIOD,
        {variables: {dates: availableDates.map( d => {
          return {
            year: d.getFullYear(),
            month: d.getMonth()+1,
            day: d.getDate()
          }} )}} )

  const [ mergeUserSettings ] =
      useMutation<UserSettings, {settings: UserSettingsInput}>( MERGE_USER_SETTINGS,
        {variables: { settings: { letitrain_maximum_tasks: userWantsMaximumTasks }} } )

  const lastMondayDate = dayjs().weekday( -7 )
  const calendarDates = new Array( DAYS_COUNT )
    .fill( undefined )
    .map(( _, i ) => lastMondayDate.add( i, 'day' ).toDate())

  const steps: StepDesc[] = [
    {
      title: 'Häufigkeit',
      headline: 'Häufigkeit angeben',
      StepComponent: <LetItRainFrequency onChange={ frequency => setUserWantsMaximumTasks( frequency )} />,
    },
    {
      title: 'Verfügbarkeit',
      headline: 'Verfügbarkeit angeben',
      StepComponent: (
        <Calendar
          dates={calendarDates}
          onChange={( dates ) => {
            setAvailableDates( dates )
          }}
        />
      ),
    },
    {
      title: 'Erinnerung',
      headline: 'Erinnerung angeben',
      StepComponent: <Container>Bla</Container>,
    },
  ]

  const finishWizard = async () => {
    await setUserAvailabilityMutation()
    await mergeUserSettings()
    history.push( '/watering/thanks' )
  }

  const getCurrentStepIndex = ( numStr: string ) => {
    let currentStepNum = parseInt( numStr ) || 0
    if ( currentStepNum >= steps.length ) currentStepNum = steps.length - 1
    return currentStepNum
  }
  const currentStepIndex = getCurrentStepIndex( stepNumber )
  const currentStep = steps[currentStepIndex]

  return (
    <Dialog
      fullScreen={fullscreenDialog}
      className={classes.dialog + ( fullscreenDialog ? '' : ' noFullscreen' )}
      open={true}
    >
      <DialogTitle className={classes.dialogTitle}>
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
        <span>{currentStep.headline}</span>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box display="flex" flexDirection="column" flexWrap="wrap" alignItems="center" justifyContent="space-between" className={classes.box}>
          <HorizontalStepper
            steps={steps.map(( { title } ) => title )}
            activeStep={currentStepIndex}
          />
          {currentStep.StepComponent}
        </Box>
      </DialogContent>
      <DialogActions>
        {currentStepIndex >= steps.length - 1 ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.dialogActionButton}
            onClick={() => finishWizard()}
          >
            fertig
          </Button>
        ) : (
          <Link
            to={`/watering/wizard/${currentStepIndex + 1}`}
            style={{ width: '100%' }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.dialogActionButton}
            >
              weiter
            </Button>
          </Link>
        )}
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() => ( {
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
