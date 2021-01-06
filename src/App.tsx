// prettier-ignore
import {
  AppBar,
  BottomNavigation,
  CssBaseline,
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
import { Link, Route, Router } from 'react-router-dom'

import { history } from './configureStore'
import {GardenOverviewPage, LandingPage} from './pages'
import {LetItRainEntry} from './pages/LetItRainEntry'
import { Login } from './components'
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
    </div>
  )
}

function a11yTabProps( index, route ) {
  return {
    component: Link,
    to: `/${route}`,
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  }
}

function App() {
  const classes = useStyles()
  const isMobile = useMediaQuery(( theme: Theme ) =>
    theme.breakpoints.down( 'sm' )
  )

  return (
    <Router history={history}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="sticky">
          <Toolbar className={classes.appBarLeft}>
            <Typography className={classes.title} variant="h3" noWrap>
              Pergola
            </Typography>
            <Typography variant="h6" color="inherit" noWrap={isMobile}>
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
          <Tabs centered>
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
    </Router>
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
    backgroundColor: theme.palette.background.default,
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
  title: {},
  navIconHide: {
    [theme.breakpoints.up( 'md' )]: {
      display: 'none',
    },
  },
  drawerHeader: { ...theme.mixins.toolbar },
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
