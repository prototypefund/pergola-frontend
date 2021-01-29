import {Box, Button, Container, IconButton, makeStyles, Menu, MenuItem, Paper, Typography} from '@material-ui/core'
import {Add, MoreVert} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {Link, Route, Switch} from 'react-router-dom'
import {useReactToPrint} from 'react-to-print'

import {PrintableCalendar, WateringHelpDrawer} from '../components'
import WateringCalendarWeek from '../components/letItRain/WateringCalendarWeek'
import {WateringDetailDrawer} from '../components/letItRain/WateringDetailDrawer'
import {webdavUrl} from '../config/calendat'
import {RootState} from '../reducers'
import BackgroundImage from '../static/background_full_grey_01.jpg'
import {LetItRainWizard} from './LetItRainWizard'


export function LetItRainEntry() {
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
          <Box display='flex' justifyContent='space-between' padding='8px'>
            <Typography variant='h2'>Unser Gießplan</Typography>
            <div>
              <IconButton component={Link} to='/watering/wizard/0' >
                <Add/>
              </IconButton>
              <IconButton onClick={( {currentTarget} ) => setMenuAnchor( currentTarget )}>
                <MoreVert/>
              </IconButton>
              <Menu keepMounted open={Boolean( menuAnchor )} anchorEl={menuAnchor} onClose={()  => setMenuAnchor( null )}>
                <MenuItem component={Link} to={webdavUrl + '/public/wateringTasks.ics'} target='_blank'>Kalender abonieren</MenuItem>
                <MenuItem onClick={handlePrint}>Exportieren/Drucken</MenuItem>
                <MenuItem onClick={() => setDrawerOpen( true )}>Hilfe</MenuItem>
              </Menu>
            </div>
          </Box>
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
    backgroundAttachment: 'fixed',
    height: '100%'

  },
} ))



