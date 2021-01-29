import {Box, Button, Container, IconButton, makeStyles, Paper, Typography} from '@material-ui/core'
import {Add, ChevronLeft as ArrowBackIcon, ChevronRight as ArrowForwardIcon} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, Route, Switch} from 'react-router-dom'

import {nextDay, previousDay} from '../actions'
import {PaperDrop, WateringHelpDrawerButton} from '../components'
import {PageTitle} from '../components/basic'
import WateringCalendarWeek from '../components/letItRain/WateringCalendarWeek'
import {WateringDetailDrawer} from '../components/letItRain/WateringDetailDrawer'
import {RootState} from '../reducers'
import BackgroundImage from '../static/background_full_grey_01.jpg'
import {LetItRainWizard} from './LetItRainWizard'


export function LetItRainEntry() {
  const dispatch = useDispatch()
  const selectedDay = useSelector<RootState, Date | undefined>(( {letItRain: { selectedDate }} ) => selectedDate )
  const classes = useStyles()
  dayjs.locale( 'de' )

  const selectPreviousDay = () => {
    dispatch( previousDay())
  }

  const selectNextDay = () => {
    dispatch( nextDay())
  }

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
            <WateringCalendarWeek preselectedDate={new Date()}/>
          </PaperDrop>
          <Box display='flex' flexDirection='row' justifyContent='space-between' flexGrow={1} alignItems='center'>
            <WateringHelpDrawerButton/>
            <Button>Kalender abbonieren</Button>
          </Box>
          {selectedDay && <Box  position='absolute' left={0} width='100%' display='flex' justifyContent='center' marginTop='40px'>
            <Paper>
              <>
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                  <IconButton onClick={selectPreviousDay}><ArrowBackIcon/></IconButton>
                  <Typography variant="h4">{selectedDay.toLocaleDateString()}</Typography>
                  <IconButton onClick={selectNextDay}><ArrowForwardIcon/></IconButton>
                </Box>
                { selectedDay && <WateringDetailDrawer/> }
              </>
            </Paper></Box>}

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



