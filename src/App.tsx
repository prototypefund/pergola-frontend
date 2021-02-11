// prettier-ignore
import './css/app.scss'

import {
  AppBar,
  BottomNavigation,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery
} from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import {
  CalendarViewDay as CalendarIcon,
  Explore as MapIcon,
  Notifications as NotificationIcon,
  Opacity as WaterdropIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import * as React from 'react'
import {withLocalize} from 'react-localize-redux'
import { Link, Route, useLocation } from 'react-router-dom'

import { Login } from './components'
import {GardenOverviewPage, LandingPage,LetItRainEntry} from './pages'
import { CalendarAndNotifications } from './pages/CalendarAndNotifications'
import backgroundImage from './static/background_full_grey_01.jpg'
import title from './static/logo-pergola-title.svg'
import { withRoot } from './withRoot'

function Routes() {
  const classes = useStyles()

  // @ts-ignore
  return (
    <div className={classes.content}>
      <Route exact={true} path="/" component={LandingPage} />
      <Route exact={true} path="/map" component={GardenOverviewPage} />
      <Route exact={true} path="/home" component={LandingPage} />
      <Route path="/watering" component={LetItRainEntry} />
      <Route path="/notifications" component={CalendarAndNotifications} />
    </div>
  )
}

function a11yTabProps( index, route ) {
  return {
    component: Link,
    to: `/${route}`,
    value: `/${route}`,
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  }
}

function App() {
  const classes = useStyles()
  const isMobile = useMediaQuery(( theme: Theme ) =>
    theme.breakpoints.down( 'sm' )
  )
  const { pathname } = useLocation()

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar className={classes.appBarLeft}>
          <svg className={classes.title} role="img">
            <title>Pergola</title>
            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={title + '#logo'} />
          </svg>
          <Typography variant="subtitle1" color="inherit" noWrap={isMobile}>
              Wurzelwerk
          </Typography>
        </Toolbar>
        <Toolbar><Login /></Toolbar>
      </AppBar>
      <Routes />
      <BottomNavigation
        className={classes.bottomBar}
        component="footer"
        color="primary"
      >
        <Tabs centered value={pathname}>
          <Tab
            icon={<MapIcon />}
            aria-label="garden map"
            {...a11yTabProps( 0, 'map' )}
          />
          <Tab
            icon={<WaterdropIcon />}
            aria-label="watering"
            {...a11yTabProps( 1, 'watering' )}
          />
          <Tab
            icon={<CalendarIcon />}
            aria-label="calendar"
            {...a11yTabProps( 2, 'home' )}
          />
          <Tab
            icon={<NotificationIcon />}
            aria-label="mentioned"
            {...a11yTabProps( 3, 'notifications' )}
          />
          <Tab
            icon={<SettingsIcon />}
            aria-label="settings"
            {...a11yTabProps( 4, 'settings' )}
          />
        </Tabs>
      </BottomNavigation>
    </div>
  )
}

const drawerWidth = 240
const useStyles = makeStyles(( theme: Theme ) => ( {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: theme.spacing( 1 ),
    paddingBottom: theme.spacing( 1 ),
    color: theme.palette.primary.contrastText,
  },
  content: {
    flex: '1 0 auto',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'fixed',
  },
  bottomBar: {
    flexShrink: 0,
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
  },
  appBarLeft: {
    flexDirection: 'column',
    alignItems: 'start',
  },
  title: {
    marginTop: '5px',
    width: '135px',
    height: '59px',
    fill: theme.palette.primary.contrastText
  },
  navIconHide: {
    [theme.breakpoints.up( 'md' )]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up( 'md' )]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
} ))

export default withLocalize( withRoot( App  ))
