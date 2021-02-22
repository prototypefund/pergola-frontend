import {gql, useMutation, useQuery} from '@apollo/client'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, useMediaQuery, useTheme} from '@material-ui/core'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import { useKeycloak } from '@react-keycloak/web'
import dayjs from 'dayjs'
import path from 'path'
import * as React from 'react'
import { useEffect ,useState} from 'react'
import {Link, useHistory, useParams, useRouteMatch} from 'react-router-dom'

import {Calendar, HorizontalStepper, LetItRainFrequency, NotificationSettings} from '../components'
import {LoginPrompt} from '../components/LoginPrompt'
import {fromNeo4jDate, toNeo4jDateInput} from '../helper'
import {_Neo4jDateInput, UserSettings, UserSettingsInput, WateringPeriod, WateringTask} from '../types/graphql'

const flatten = ( a: any[] ) => Array.prototype.concat.apply( [], a )

export interface LetItRainWizardRouterProps {
  stepNumber: string;
}

interface StepDesc {
  title: string;
  headline: string;
  StepComponent: JSX.Element;
}

const DAYS_COUNT = 14

const SET_USER_AVAILABLITY_FOR_WATERING_PERIOD = gql`
mutation  setUserAvailability($gardenId: ID!, $dates: [_Neo4jDateInput]!) { 
  setUserAvailability(
      gardenId: $gardenId
      dates: $dates
  )
}
`

const MERGE_USER_SETTINGS = gql`
mutation mergeUserSettings($settings: UserSettingsInput!) {
    ownMergeUserSettings (
        settings: $settings
    ) { letitrain_maximum_tasks }
}
`

const ASSIGNABLE_WATERING_PERIOD = gql`
  query assignableWateringPeriod($gardenId: ID!) {
      assignableWateringPeriod(gardenId: $gardenId) {
          _id
          wateringtasks { _id date { day year month } } 
          from { year, month, day }
          till { year, month, day }
      }
  }
`

const USER_AVAILABLE_TASKS = gql`
query WateringTask($userId: String, $gardenId: ID!) {
    WateringTask( filter: {
        AND: [
            {wateringperiod: { at: { gardenId: $gardenId } } } ,
            {users_available_some: { id: $userId } }
        ]
    }) {
        _id
        date { day month year }
    }
}
`

export function LetItRainWizard() {
  const { keycloak: { authenticated,  subject: userId } } = useKeycloak()
  const theme = useTheme()
  const classes = useStyles()
  const history = useHistory()
  const { url } = useRouteMatch()
  const { gardenId } = useParams<{gardenId: string}>()
  const { stepNumber } = useParams<LetItRainWizardRouterProps>()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))
  const [availableDates, setAvailableDates] = useState<Array<Date>>( [] )
  const [userWantsMaximumTasks, setUserWantsMaximumTasks] = useState( 1 )
  const {data: assignableWateringPeriodData } = useQuery<{assignableWateringPeriod: WateringPeriod[]}, {gardenId: string}>(
    ASSIGNABLE_WATERING_PERIOD,
    {variables: {gardenId}} )

  const {data: availableWateringTasksData } =  userId && useQuery<{WateringTask: WateringTask[]}, {gardenId: string, userId: string}>(
    USER_AVAILABLE_TASKS,
    {variables: {gardenId, userId}}
  ) || {}
  const availableTasks = availableWateringTasksData?.WateringTask

  useEffect(() => {
    if( !availableTasks || availableTasks.length <= 0 ) return
    const _availableDates = availableTasks.map( t => fromNeo4jDate( t.date ))
    setAvailableDates( _availableDates )
  }, [availableTasks] )

  const [setUserAvailabilityMutation] =
      useMutation<boolean, { dates: Array<_Neo4jDateInput>, gardenId: string }>( SET_USER_AVAILABLITY_FOR_WATERING_PERIOD,
        {variables: {dates: availableDates.map( toNeo4jDateInput ), gardenId}} )

  const [ mergeUserSettings ] =
      useMutation<UserSettings, {settings: UserSettingsInput}>( MERGE_USER_SETTINGS,
        {variables: { settings: { letitrain_maximum_tasks: userWantsMaximumTasks }} } )

  const lastMondayDate = dayjs().weekday( -7 )
  const tasks = flatten( assignableWateringPeriodData?.assignableWateringPeriod?.map(( {wateringtasks} ) => wateringtasks ) || [] )
  const calendarDates = tasks.length === 0
    ? [...Array( DAYS_COUNT )]
      .map(( _, i ) => lastMondayDate.add( i, 'day' ).toDate())
    :  tasks.map( t => t ? fromNeo4jDate( t.date ) : new Date())

  const steps: StepDesc[] = [
    {
      title: 'Häufigkeit',
      headline: 'Häufigkeit angeben',
      StepComponent:
        <LetItRainFrequency
          frequency={userWantsMaximumTasks}
          onChange={ frequency => setUserWantsMaximumTasks( frequency )} />
    },
    {
      title: 'Verfügbarkeit',
      headline: 'Verfügbarkeit angeben',
      StepComponent:
        <Calendar
          dates={calendarDates}
          selectedDates={availableDates}
          onChange={( dates ) => {
            setAvailableDates( dates )
          }}/>
    },
    {
      title: 'Erinnerung',
      headline: 'Erinnerung angeben',
      StepComponent: <NotificationSettings />,
    },
  ]
  const getCurrentStepIndex = ( numStr: string ) => {
    let currentStepNum = parseInt( numStr ) || 0
    if ( currentStepNum >= steps.length ) currentStepNum = steps.length - 1
    return currentStepNum
  }
  const currentStepIndex = getCurrentStepIndex( stepNumber )
  const currentStep = steps[currentStepIndex]

  const finishWizard = async () => {
    console.log( availableDates )
    await setUserAvailabilityMutation()
    await mergeUserSettings()
    history.push( `/${gardenId}/watering/thanks` )
  }


  return authenticated ?
    ( <Dialog
      fullScreen={fullscreenDialog}
      className={classes.dialog + ( fullscreenDialog ? '' : ' noFullscreen' )}
      open={true}
    >
      <DialogTitle className={classes.dialogTitle}>
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
        <span className={classes.dialogTitleText}>{currentStep.headline}</span>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box display="flex" flexDirection="column" flexWrap="nowrap" alignItems="center" justifyContent="space-between" className={classes.box}>
          <HorizontalStepper steps={steps.map(( { title } ) => title )} activeStep={currentStepIndex}  />
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
            to={path.resolve( `${url}/../${currentStepIndex + 1}` )}
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
    ) :
    (
      <LoginPrompt />
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
    paddingBottom: 0,
    '& h2': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  dialogTitleText: {
    position: 'relative',
    left: '-20px',
    margin: '0 auto',
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
