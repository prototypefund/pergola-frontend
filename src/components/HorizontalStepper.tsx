import {makeStyles, Theme, Typography} from '@material-ui/core'
import * as React from 'react'

export interface StepProps {
  title: String;
  first?: Boolean;
  last?: Boolean;
  passed?: Boolean;
  active?: Boolean;
}

export function Step( {title, first, last, passed, active}: StepProps ) {
  const classes = useStyles()

  return (
    <div className={classes.step + ( passed ? ' passed' : '' ) + ( active ? ' active' : '' )} style={{flexGrow: 1}}>
      <div className="event1Dot">
        <div className={first ? 'invisible left line' : 'left line'}/>
        <div className="circle"/>
        <div className={last ? 'invisible right line' : 'right line'}/>
      </div>
      <Typography className="title">{title}</Typography>
    </div>
  )
}

export interface StepperProps {
  steps: String[],
  activeStep: number
}

export function HorizontalStepper( {steps, activeStep}: StepperProps ) {
  const classes = useStyles()

  return (
    <div className={classes.timeline}>
      <div className={classes.steps}>
        {steps.map(( title, i ) => ( <Step
          key={i}
          first={i === 0}
          last={i === steps.length - 1}
          title={title}
          passed={activeStep > i}
          active={activeStep === i}
        /> ))}
      </div>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  steps: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
    '&.passed': {
      '& .right.line': {
        backgroundColor: theme.palette.success.main
      }
    },
    '&.active': {
      '& .circle': {
        backgroundColor: theme.palette.success.main
      }
    },
    '&.passed, &.active': {
      '& .left.line': {
        backgroundColor: theme.palette.success.main
      },
      '& .circle': {
        'borderColor': theme.palette.success.main
      }
    },
    '& .event1Dot': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '8px',
      '& .circle': {
        'height': '12px',
        'width': '12px',
        'borderRadius': '50%',
        'border': '2px solid #dfdfdf',
        'backgroundColor': '#f8f8f8',
      },
      '& .line': {
        flexGrow: 1,
        height: '4px',
        backgroundColor: '#f8f8f8',
        '&.invisible': {
          visibility: 'hidden'
        }
      }
    },
    '& .title': {
      textTransform: 'uppercase',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '12pt'
    }
  },
  timeline: {
    maxWidth: '800px',
    marginBottom: '2rem',
    '@media (max-width:320px)': {
      marginBottom: '1rem',
    },
  },
} ))
