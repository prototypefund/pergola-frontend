import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import { useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import { Calendar, HorizontalStepper, LetItRainFrequency } from '../components'

export interface LetItRainWizardRouterProps {
  stepNumber: string;
}

interface StepDesc {
  title: String;
  headline: String;
  StepComponent: JSX.Element;
}

const DAYS_COUNT = 14

export function LetItRainWizard() {
  const theme = useTheme()
  const classes = useStyles()
  const history = useHistory()
  const { stepNumber } = useParams<LetItRainWizardRouterProps>()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))
  const [, setAvailableDates] = useState<Date[]>( [] )

  const lastMondayDate = dayjs().weekday( -7 )
  const calendarDates = new Array( DAYS_COUNT )
    .fill( undefined )
    .map(( _, i ) => lastMondayDate.add( i, 'day' ).toDate())

  const steps: StepDesc[] = [
    {
      title: 'Häufigkeit',
      headline: 'Häufigkeit angeben',
      StepComponent: <LetItRainFrequency />,
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

  const finishWizard = () => {
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
      <DialogTitle>
        <Toolbar>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{currentStep.headline}</Typography>
        </Toolbar>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box display="flex" flexDirection="column" alignItems="center">
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
  dialogContent: {
    position: 'relative'
  },
  dialogActionButton: {
    padding: '1.083rem',
    borderRadius: 0,
    textTransform: 'uppercase',
    fontSize: '1.333rem',
    fontWeight: 'bold',
  }
} ))
