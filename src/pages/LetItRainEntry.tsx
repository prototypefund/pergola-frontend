import {Box, Button, Container, makeStyles, Typography} from '@material-ui/core'
import dayjs from 'dayjs'
import * as React from 'react'
import {Link, Route, Switch} from 'react-router-dom'

import {PaperDrop, WeekSelector} from '../components'
import WateringCalendarWeek from '../components/letItRain/WateringCalendarWeek'
import {LetItRainWizard} from './LetItRainWizard'


export function LetItRainEntry() {
  const classes = useStyles()
  dayjs.locale( 'de' )
  const today = dayjs()

  return (
    <Container className={classes.main} component="main">
      <Box textAlign='center'>
        <Typography variant='h2' className={classes.title}>Let it rain!</Typography>
        <hr className={classes.titleDivider} />
      </Box>
      <PaperDrop>
        <WeekSelector>
          {( {startDate, dayCount} ) => (
            <Box display='flex' alignItems='center' flexDirection='column'>
              <WateringCalendarWeek startDate={startDate} dayCount={dayCount} />
              {dayjs( startDate ).isAfter( today.add( 3, 'week' )) &&
                <Link to='/watering/wizard/0' >
                  <Button variant='contained' color='primary'>Verfügbarkeit eintragen</Button>
                </Link>
              }
            </Box>
          )}
        </WeekSelector>
      </PaperDrop>
      <Switch>
        <Route path='/watering/wizard/:stepNumber' component={LetItRainWizard} />
      </Switch>
    </Container>
  )
}


const useStyles = makeStyles(() => ( {
  main: {
    minHeight:  '500px'

  },
  title: {
    fontFamily: 'Pacifico'
  },
  titleDivider: {
    height: 0,
    borderStyle: 'solid',
    borderColor: '#13AB8C',
    borderWidth: '2pt',
    backgroundColor: '#13AB8C',
    borderRadius: '2pt',
    fontWeight: 'normal',
    width: '25px'
  },
} ))



