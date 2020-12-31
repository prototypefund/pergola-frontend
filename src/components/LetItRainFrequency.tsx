import {
  makeStyles,
  Slider,
  Theme,
  Typography
} from '@material-ui/core'
import * as React from 'react'
import {useState} from 'react'


export function LetItRainFrequency() {
  const classes = useStyles()
  const [daysPerWeek, setDaysPerWeek] = useState( 2 )

  return (
    <>
      <Typography variant='h2' className={classes.question} >Wie oft moechtest du maximal giessen?</Typography>
      <Slider
        min={2}
        max={6}
        value={daysPerWeek}
        onChange={( _, value ) => setDaysPerWeek( typeof value == 'number' ? value : 2  )}
        aria-labelledby="discrete-slider-always"
        step={1}
        valueLabelDisplay="on"
      />
      <Typography variant='body1' >{daysPerWeek} mal pro Woche</Typography>
    </>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  question: {
    textAlign: 'center',
    fontFamily: 'Alegreya',
    width: '70%',
    margin: '38px 0 58px 0'
  }
} ))
