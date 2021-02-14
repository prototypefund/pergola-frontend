import {Box, IconButton, makeStyles, Menu, MenuItem, Paper, Toolbar, Typography} from '@material-ui/core'
import {Add, MoreVert, Today} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useRef, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {Link, Route, Switch} from 'react-router-dom'
import {useReactToPrint} from 'react-to-print'

import {selectDay} from '../actions'
import {LetItRainSurveyFab, PrintableCalendar, WateringHelpDrawer} from '../components'
import WateringCalendarWeek from '../components/letItRain/WateringCalendarWeek'
import {WateringDetailDrawer} from '../components/letItRain/WateringDetailDrawer'
import {webdavUrl} from '../config/calendat'
import {RootState} from '../reducers'
import BackgroundImage from '../static/background_full_grey_01.jpg'
import {LetItRainAvailabilityDialog} from './LetItRainAvailabilityDialog'
import {LetItRainThanksDialog} from './LetItRainThanksDialog'
import {LetItRainWizard} from './LetItRainWizard'


export function LetItRainEntry() {
  const { t } = useTranslation( 'letItRain' )
  const dispatch = useDispatch()
  const selectedDay = useSelector<RootState, Date | undefined>(( {letItRain: { selectedDate }} ) => selectedDate )
  const classes = useStyles()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>( null )
  const [drawerOpen, setDrawerOpen] = useState( false )
  const calendarRef = useRef( null )
  const handlePrint = useReactToPrint( { content: () => calendarRef.current} )

  return (
    <>
      <Box className={`${classes.main} page`} component="main"  display='flex' flexDirection='column'>
        <Paper>
          <Toolbar className={classes.toolbar}>
            <Typography variant='h4'>{t( 'ourWateringPlan' )}</Typography>
            <div>
              <IconButton onClick={() => dispatch( selectDay( new Date())) }>
                <Today/>
              </IconButton>
              <IconButton component={Link} to='/watering/wizard/0' >
                <Add/>
              </IconButton>
              <IconButton edge="end" onClick={( {currentTarget} ) => setMenuAnchor( currentTarget )}>
                <MoreVert/>
              </IconButton>
              <Menu keepMounted open={Boolean( menuAnchor )} anchorEl={menuAnchor} onClose={()  => setMenuAnchor( null )}>
                <MenuItem component={Link} to={webdavUrl + '/public/wateringTasks.ics'} target='_blank'>Kalender abonieren</MenuItem>
                <MenuItem onClick={handlePrint}>Exportieren/Drucken</MenuItem>
                <MenuItem onClick={() => setDrawerOpen( true )}>Hilfe</MenuItem>
              </Menu>
            </div>
          </Toolbar>
          <WateringCalendarWeek preselectedDate={new Date()}/>
        </Paper>
        <WateringHelpDrawer drawerOpen={drawerOpen} onClose={() => setDrawerOpen( false )}/>
        {selectedDay && <Box width='100%' display='flex' justifyContent='center' marginTop='40px'>
          <Paper>
            <WateringDetailDrawer/>
          </Paper>
        </Box>}
      </Box>
      <Box display='none'>
        <PrintableCalendar childRef={calendarRef} />
      </Box>
      <LetItRainSurveyFab/>
      <Switch>
        <Route path='/watering/wizard/:stepNumber' component={LetItRainWizard} />
        <Route path="/watering/availability/:startDate" render={ ( { match } ) => {
          const { startDate = new Date()} = match.params
          return ( <LetItRainAvailabilityDialog startDate={dayjs( startDate, 'YYYY-MM-DD' ).toDate()} /> )
        }} />
        <Route path='/watering/thanks' component={LetItRainThanksDialog}/>
      </Switch>
    </>
  )
}


const useStyles = makeStyles(() => ( {
  main: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    height: '100%'
  },
  toolbar: {
    justifyContent: 'space-between'
  }
} ))



