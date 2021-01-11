import 'dayjs/plugin/weekday'

import {gql, useMutation} from '@apollo/client'
import {
  Box, Button, Container,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Theme, Toolbar,
  Typography, useMediaQuery, useTheme
} from '@material-ui/core'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useState} from 'react'
import {Link, RouteComponentProps, useHistory, useParams} from 'react-router-dom'

import {Calendar, HorizontalStepper, LetItRainFrequency} from '../components'

export interface LetItRainWizardRouterProps {
  stepNumber: string
}

interface StepDesc {
  title: String,
  headline: String,
  StepComponent: JSX.Element
}

const DAYS_COUNT = 14

const SET_USER_AVAILABLITY_FOR_WATERING_PERIOD = gql`
mutation  setUserAvailability($dates: [_Neo4jDateInput]!) { 
  setUserAvailability(
    dates: $dates
  )
}
`

export function LetItRainWizard( {match}: RouteComponentProps ) {
  const theme = useTheme()
  const classes = useStyles()
  const history = useHistory()
  const {stepNumber} = useParams<LetItRainWizardRouterProps>()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))
  const [availableDates, setAvailableDates] = useState<Array<Date>>( [] )
  console.log(availableDates)  // TODO: This contains one date less than selected

  const [setUserAvailabilityMutation] =
      useMutation<{ dates: Array<Date> }, any>( SET_USER_AVAILABLITY_FOR_WATERING_PERIOD,
        {variables: {dates: availableDates.map( d => {
          return {
            year: d.getFullYear(),
            month: d.getMonth()+1,
            day: d.getDate()
          }} )}} )


  const lastMondayDate = dayjs().weekday( -7 )
  const calendarDates = ( new Array( DAYS_COUNT )).fill( undefined )
    .map(( _, i ) => lastMondayDate.add( i, 'day' ).toDate())

  const steps: StepDesc[] = [
    {
      title: 'Termine',
      headline: 'Giessdienst eintragen',
      StepComponent: <Calendar dates={calendarDates} onChange={( dates ) => {setAvailableDates( dates )}}/>
    },
    {title: 'Hauefigekeit', headline: 'Giessdienst eintragen', StepComponent: <LetItRainFrequency/>},
    {title: 'Erinnerung', headline: 'Giessdienst eintragen', StepComponent: <Container>Bla</Container>},
  ]

  const finishWizard = async () => {
    const success = await setUserAvailabilityMutation()
    console.log( success )
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
    <Dialog fullScreen={fullscreenDialog} className={classes.dialog + ( fullscreenDialog ? '' : ' noFullscreen' )}
      open={true}>
      <DialogTitle>
        <Toolbar>
          <IconButton onClick={() => history.goBack()}><ArrowBackIcon/></IconButton>
          <Typography variant="h6">{currentStep.headline}</Typography>
        </Toolbar>
      </DialogTitle>
      <DialogContent>
        <Box my={2} display='flex' flexDirection='column' alignItems='center'>
          <HorizontalStepper steps={steps.map(( {title} ) => title )} activeStep={currentStepIndex}/>
          {currentStep.StepComponent}
        </Box>
      </DialogContent>
      <DialogActions>
        {currentStepIndex >= steps.length - 1
          ? <Button fullWidth variant='contained' color='primary' onClick={() => finishWizard()}>fertig</Button>
          : <Link to={`/watering/wizard/${currentStepIndex + 1}`} style={{width: '100%'}}>
            <Button fullWidth variant='contained' color='primary'>weiter</Button>
          </Link>
        }
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  dialog: {
    '&.noFullscreen .MuiDialog-paper': {
      minHeight: '800px',
      minWidth: '700px'
    }
  }
} ))
