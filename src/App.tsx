// prettier-ignore
import {
  AppBar,
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
import { Link, Route, Router } from 'react-router-dom'

import { history } from './configureStore'
import { HomePage } from './pages'
import { withRoot } from './withRoot'

function Routes() {
  const classes = useStyles()

  // @ts-ignore
  return (
    <div className={classes.content}>
      <Route exact={true} path="/" component={HomePage} />
      <Route exact={true} path="/home" component={HomePage} />
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
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <div className={classes.leftToolbarContainer}>
                <Typography className={classes.title} variant="h3" noWrap>
                  Pergola
                </Typography>
                <Typography variant="h6" color="inherit" noWrap={isMobile}>
                  Wurzelwerk
                </Typography>
              </div>
            </Toolbar>
          </AppBar>
          <Routes />
          <AppBar className={classes.bottomBar}>
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
          </AppBar>
        </div>
      </div>
    </Router>
  )
}

const drawerWidth = 240
const useStyles = makeStyles(( theme: Theme ) => ( {
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  leftToolbarContainer: {},
  appBar: {
    minHeight: 128,
    alignItems: 'flex-start',
    paddingTop: theme.spacing( 1 ),
    paddingBottom: theme.spacing( 2 ),
    zIndex: theme.zIndex.drawer + 1,
    position: 'absolute',
  },
  bottomBar: {
    top: 'auto',
    bottom: 0,
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
  },
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
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: 'calc(100% - 128px)',
    marginTop: 128,
    [theme.breakpoints.up( 'sm' )]: {
      height: 'calc(100% - 128px)',
      marginTop: 128,
    },
  },
} ))

export default withRoot( App )
