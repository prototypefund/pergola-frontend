import {Button, makeStyles, Step, StepLabel, Stepper, Theme, Typography} from '@material-ui/core'
import * as React from 'react'

export interface StepperProps {
  steps: string[],
  activeStep: number
}

export function HorizontalStepper( {steps, activeStep}: StepperProps ) {
  const classes = useStyles()

  return (
    <Stepper className={classes.root} activeStep={activeStep} alternativeLabel>
      {steps.map(( label ) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

const useStyles = makeStyles(( theme ) => ( {
  root: {
    minWidth: '350px',
    padding: 0,
    marginBottom: '1.5rem'
  }
} ))
