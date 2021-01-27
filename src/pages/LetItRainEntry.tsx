import {Box, Button, Container, makeStyles} from '@material-ui/core'
import {Add, PlusOne} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {Link, Route, Switch} from 'react-router-dom'

import {PaperDrop, WateringHelpDrawerButton, WeekSelector} from '../components'
import {PageTitle} from '../components/basic'
import WateringCalendarWeek from '../components/letItRain/WateringCalendarWeek'
import BackgroundImage from '../static/background_full_grey_01.jpg'
import {LetItRainWizard} from './LetItRainWizard'


export function LetItRainEntry() {
  const classes = useStyles()
  dayjs.locale( 'de' )
  const today = dayjs()

  return (
    <>
      <Box className={`${classes.main} page`} component="main"  display='flex' flexDirection='column'>
        <PageTitle title="Gießplan!"/>
        <Container>
          <PaperDrop>
            {
              <Box display='flex' justifyContent='flex-end'>
                <Link to='/watering/wizard/0' >
                  <Button  variant='contained' color='primary' startIcon={<Add />}>Verfügbarkeit eintragen</Button>
                </Link>
              </Box>
            }
            <WeekSelector date={today.toDate()}>
              {( {startDate, dayCount, nextPage, prevPage} ) => (
                <Box display='flex' alignItems='center' flexDirection='column' overflow='hidden'>
                  <WateringCalendarWeek startDate={startDate} dayCount={dayCount} onNextPageRequested={nextPage} onPrevPageRequested={prevPage} />
                </Box>
              )}
            </WeekSelector>
          </PaperDrop>
          <Box display='flex' flexDirection='row' justifyContent='space-between' flexGrow={1} alignItems='center'>
            <WateringHelpDrawerButton/>
            <Button>Kalender abbonieren</Button>
          </Box>
        </Container>
      </Box>
      <Switch>
        <Route path='/watering/wizard/:stepNumber' component={LetItRainWizard} />
      </Switch>
    </>
  )
}


const useStyles = makeStyles(() => ( {
  main: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'fixed',
    height: '100%'

  },
} ))



