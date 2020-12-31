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

export function LetItRainWizard( {match}: RouteComponentProps ) {
  const theme = useTheme()
  const classes = useStyles()
  const history = useHistory()
  const {stepNumber} = useParams<LetItRainWizardRouterProps>()
  const fullscreenDialog = useMediaQuery( theme.breakpoints.down( 'md' ))

  const steps: StepDesc[] = [
    {title: 'Termine', headline: 'Giessdienst eintragen', StepComponent: <Calendar/>},
    {title: 'Hauefigekeit', headline: 'Giessdienst eintragen', StepComponent: <LetItRainFrequency/>},
    {title: 'Erinnerung', headline: 'Giessdienst eintragen', StepComponent: <Container>Bla</Container>},
  ]


  const getCurrentStepIndex = ( numStr: string ) => {
    let currentStepNum = parseInt( numStr ) || 0
    if ( currentStepNum >= steps.length ) currentStepNum = steps.length - 1
    return currentStepNum
  }
  const currentStepIndex = getCurrentStepIndex( stepNumber )
  const currentStep = steps[currentStepIndex]

  return (
    <Dialog fullScreen={fullscreenDialog} className={classes.dialog + ( fullscreenDialog ? '' : ' noFullscreen' )} open={true}>
      <DialogTitle>
        <Toolbar>
          <IconButton onClick={() => history.goBack()}><ArrowBackIcon/></IconButton>
          <Typography variant="h6" >{currentStep.headline}</Typography>
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
          ? <Link to={ '/watering/thanks'} style={{width: '100%'}}>
            <Button fullWidth variant='contained' color='primary'>fertig</Button>
          </Link>
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
