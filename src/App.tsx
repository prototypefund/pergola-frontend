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
  EventNote as EventNoteIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Opacity as WaterdropIcon,
  Person as PersonIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import * as React from 'react'
import {withLocalize} from 'react-localize-redux'
import { Link, Route, useLocation, useParams, useRouteMatch } from 'react-router-dom'

import { Login } from './components'
import {GardenOverviewPage, Home, LandingPage, LetItRainEntry, Settings} from './pages'
import { CalendarAndNotifications } from './pages/CalendarAndNotifications'
import backgroundImage from './static/background_full_grey_01.jpg'
import title from './static/logo-pergola-title.svg'
import { withRoot } from './withRoot'

function Routes() {
  const { path } = useRouteMatch()
  console.log( {path} )
  const classes = useStyles()

  // @ts-ignore
  return (
    <div className={classes.content}>
      <Route exact={true} path={`${path}/home`} component={Home} />
      <Route path={`${path}/map`} component={GardenOverviewPage} />
      <Route path={`${path}/watering`} component={LetItRainEntry} />
      <Route path={`${path}/notifications`} component={CalendarAndNotifications} />
      <Route path={`${path}/settings`} component={Settings} />
    </div>
  )
}


function App() {
  const classes = useStyles()
  const { url } = useRouteMatch()
  const { gardenId } = useParams<{gardenId: string}>()
  const isMobile = useMediaQuery(( theme: Theme ) =>
    theme.breakpoints.down( 'sm' )
  )
  const { pathname } = useLocation()

  function a11yTabProps( index, route ) {
    const linkTo = `${url}/${route}`
    return {
      selected: pathname.startsWith( linkTo ),
      component: Link,
      to: linkTo,
      value: linkTo,
      id: `scrollable-prevent-tab-${index}`,
      'aria-controls': `scrollable-prevent-tabpanel-${index}`,
    }
  }
  return (
    <>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar className={classes.appBarLeft}>
          <svg className={classes.title} role="img">
            <title>Pergola</title>
            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={title + '#logo'} />
          </svg>
          <Typography variant="subtitle1" color="inherit" noWrap={isMobile} >{gardenId}</Typography>
        </Toolbar>
        <Toolbar><Login /></Toolbar>
      </AppBar>
      <Routes />
      <BottomNavigation
        className={classes.bottomBar}
        component="footer"
        color="primary"
      >
        <Tabs centered value={false}>
          <Tab
            icon={<HomeIcon/>}
            aria-label="home"
            {...a11yTabProps( 0, 'home' )}
          />
          <Tab
            icon={<MapIcon />}
            aria-label="garden map"
            {...a11yTabProps( 1, 'map' )}
          />
          <Tab
            icon={<WaterdropIcon />}
            aria-label="watering"
            {...a11yTabProps( 2, 'watering' )}
          />
          <Tab
            icon={<EventNoteIcon />}
            aria-label="mentioned"
            {...a11yTabProps( 3, 'notifications' )}
          />
          <Tab
            icon={<PersonIcon />}
            aria-label="profile settings"
            {...a11yTabProps( 4, 'settings' )}
          />
        </Tabs>
      </BottomNavigation>
    </>
  )
}

const drawerWidth = 240
const useStyles = makeStyles(( theme: Theme ) => ( {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'fixed',
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
  },
  bottomBar: {
    zIndex: theme.zIndex.appBar,
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

function RootApp() {
  const classes = useStyles()
  return <div className={classes.root}>
    <Route exact={true} path="/" component={LandingPage}/>
    <Route path="/:gardenId" component={App} />
  </div>
}

export default withLocalize( withRoot( RootApp  ))
