import {
  AppBar,
  Box, Button,
  Container, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  Slider,
  Theme,
  Toolbar,
  Typography
} from '@material-ui/core'
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons'
import * as React from 'react'
import {useState} from 'react'

import {HorizontalStepper} from '../components/HorizontalStepper'


export function LetItRainFrequency() {
  const classes = useStyles()
  const [daysPerWeek, setDaysPerWeek] = useState( 2 )
  const steps = ['termine', 'haeufigkeit', 'erinnerung']
  const activeStep = 0

  return (
    <Dialog open={true}>
      <DialogTitle>
        <Toolbar>
          <IconButton><ArrowBackIcon/></IconButton>
          <Typography variant="h6">Giessdiesnt eintragen</Typography>
        </Toolbar>
      </DialogTitle>
      <DialogContent className={classes.main}>
        <Box my={2} display='flex' flexDirection='column' alignItems='center'>
          <HorizontalStepper steps={steps} activeStep={activeStep}/>
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
        </Box>
        <DialogActions>
          <Button fullWidth variant='contained' color='primary' >weiter</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  main: {
    marginTop: '8px'
  },
  question: {
    textAlign: 'center',
    fontFamily: 'Alegreya',
    width: '70%',
    margin: '38px 0 58px 0'
  }
} ))
