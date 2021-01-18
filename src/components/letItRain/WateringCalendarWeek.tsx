import {gql, useQuery} from '@apollo/client'
import {Box, Button, Container, Drawer, IconButton, Link, makeStyles, Toolbar, Typography} from '@material-ui/core'
import {
  AddCircle, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon
} from '@material-ui/icons'
import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {equalsNeo4jDate, fromNeo4JDate, toNeo4JDate} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDate, WateringPeriod, WateringTask} from '../../types/graphql'
import {WateringDetailDrawer} from './WateringDetailDrawer'

interface WateringDayProps {
  date: Date;
  recruiterCount: number;
  onSelect?: Function;
  active?: Boolean;
  notInPeriod?: Boolean;
  itsMyTurn?: Boolean;
}

const WateringDay = ( {date, recruiterCount, onSelect, active, notInPeriod, itsMyTurn}: WateringDayProps ) => {
  const d = dayjs( date )
  const classes = useStyles()

  const optimalRecruiters = 3
  const recruiterMissingCount = optimalRecruiters - recruiterCount
  const droughtWarningClass = ( rmissing: number ) => {
    if ( rmissing >= 2 ) {
      return 'droughtrisk2'
    }
    if ( rmissing === 1 ) {
      return 'droughtrisk1'
    }
    return ''
  }

  return (
    <Link onClick={() => onSelect && onSelect()} component="button">
      <Container className={`${classes.dayContainer} ${active && 'active'} ${notInPeriod && 'notInPeriod'}`}>
        <div>
          <Typography component="h4">{d.format( 'dd' )}</Typography>
        </div>
        <div className={`dayInMonth ${droughtWarningClass( recruiterMissingCount )}`}>

          <Typography component="h4">{d.format( 'D' )}</Typography>
        </div>
        <div>{recruiterMissingCount > 0 && !itsMyTurn && !notInPeriod && <AddCircle/>}</div>
      </Container>
    </Link>
  )
}

interface WateringCalendarWeekProps {
  startDate: Date;
  dayCount: number;
  onNextPageRequested?: () => any;
  onPrevPageRequested?: () => any;
}
const GET_WATERING_TASKS = gql`
query WateringTask($dateFrom: _Neo4jDateInput, $dateTo: _Neo4jDateInput) {
    WateringTask(filter:
    { AND: [
        { date_gte: $dateFrom },
        { date_lte: $dateTo } ]
    }) {
        date { day month year}
        users_assigned { label }
        users_available { label }
    }
}
`

const GET_WATERING_PERIOD = gql`
query WateringPeriod($date: _Neo4jDateInput) {
    WateringPeriod( filter: 
    { AND: [ 
        { from_lte: $date },
        { till_gte: $date } ] 
    }) {
        from { day month year }
        till { day month year }
        wateringtasks {
            date { day month year }
            users_assigned { label }
            users_available { label }
        }
    }
}
`
const WateringCalendarWeek = ( {startDate, dayCount, onNextPageRequested, onPrevPageRequested}: WateringCalendarWeekProps ) => {
  const classes = useStyles()
  const [selectedDay, selectDay] = useState<{index: number,date?: Date}>( { index: -1 } )
  const [drawerWateringDay, setDrawerWateringDay] = useState<boolean>( false )
  const {data: wateringTasksData} = useQuery<{WateringTask: WateringTask[]}, { dateFrom: _Neo4jDate, dateTo: _Neo4jDate}>( GET_WATERING_TASKS, {
    variables: {
      dateFrom: toNeo4JDate( startDate ),
      dateTo: toNeo4JDate( dayjs( startDate ).add( dayCount - 1 , 'day' ).toDate())
    }
  } )
  const {data: wateringPeriodData} = useQuery<{WateringPeriod: WateringPeriod[]}, { date: _Neo4jDate}>( GET_WATERING_PERIOD, {
    variables: {
      date: toNeo4JDate( startDate )
    }
  } )
  const defaultCalendarDates = ( c: number, d: Date ) => [...Array( dayCount )]
    .map(( _, i ) => dayjs( d ).add( i, 'day' ))
    .map(( date ) => ( {
      date,
      itsMyTurn: false,
      recruiterCount: 0,
      notInPeriod: true
    } ))
  const [calendarDates, setCalendarDates] = useState( defaultCalendarDates( dayCount, startDate ))
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )

  useEffect(() => {
    const getPeriod = () => {
      if( !wateringPeriodData
          || !Array.isArray( wateringPeriodData.WateringPeriod )
          || wateringPeriodData.WateringPeriod.length === 0 ) return null
      const { WateringPeriod: [ wp] } = wateringPeriodData
      //const { wateringtasks } = wp
      if( !wp.from || !wp.till )
        return null
      return {
        from: wp.from,
        till: wp.till
      }
    }
    const period = getPeriod()
    if( !wateringTasksData ) {
      setCalendarDates( defaultCalendarDates( dayCount, startDate ))
    } else {
      const withinPeriod = ( date: dayjs.Dayjs ) => {
        if( !period ) return false
        const {from, till} = period
        const _from = dayjs( fromNeo4JDate( from ))
        const _till = dayjs( fromNeo4JDate( till ))
        return  date.isSame( _from ) || date.isSame( _till ) || ( date.isBefore( _till ) && date.isAfter( _from ))
      }
      const wateringtasks = wateringTasksData && wateringTasksData.WateringTask
      setCalendarDates(
        [...Array( dayCount )]
          .map(( _, i ) => dayjs( startDate ).add( i, 'day' ))
          .map( date => {
            const task = Array.isArray( wateringtasks ) && wateringtasks.find( t => t && equalsNeo4jDate( t.date, date.toDate()))
            return {
              date,
              itsMyTurn: !!( task && task.users_assigned && task.users_assigned.findIndex(( user ) => userProfile && user && userProfile.username === user.label ) >= 0 ),
              recruiterCount: task && task.users_assigned && task.users_assigned.length || 0,
              notInPeriod: !task && !withinPeriod( date ) //TODO: we need another way to reliably detect periods
            }
          } ))

    }
  }, [startDate, wateringPeriodData, wateringTasksData] )



  const select = ( i, date ) => {
    selectDay( { index: i, date } )
    if ( i >= 0 ) {
      setDrawerWateringDay( true )
    } else {
      setDrawerWateringDay( false )
    }
  }

  const selectPreviousDay = () => {
    const i = selectedDay.index - 1
    if( i >= 0 )
      selectDay( {index: i, date: dayjs( selectedDay.date ).subtract( 1, 'day' ).toDate()} )
    else if( onPrevPageRequested ) {
      onPrevPageRequested()
      selectDay( {index: dayCount - 1, date: dayjs( selectedDay.date ).subtract( 1, 'day' ).toDate()} )
    }
  }

  const selectNextDay = () => {
    const i = selectedDay.index + 1
    if( i < dayCount )
      selectDay( {index: i, date: dayjs( selectedDay.date ).add( 1, 'day' ).toDate()} )
    else if( onNextPageRequested ) {
      onNextPageRequested()
      selectDay( {index: 0, date: dayjs( selectedDay.date ).add( 1, 'day' ).toDate()} )
    }
  }

  return (
    <>
      <Box display="flex" flexDirection="row" className={classes.weekContainer}>
        {calendarDates.map(( { date, recruiterCount, notInPeriod }, i ) => (
          <WateringDay
            onSelect={() => select( i, date.toDate())}
            active={selectedDay.index === i}
            key={date.toISOString()}
            date={date.toDate()}
            recruiterCount={recruiterCount}
            notInPeriod={notInPeriod}
          />
        ))}
      </Box>
      <Drawer
        variant="persistent"
        anchor="bottom"
        open={drawerWateringDay}
        onClose={() => setDrawerWateringDay( false )}>
        <Box className={classes.drawerToolbar} display='flex' flexDirection='row' justifyContent='space-between'>
          <IconButton onClick={selectPreviousDay}><ArrowBackIcon/></IconButton>
          <Typography variant="h6">{selectedDay && selectedDay.date?.toLocaleDateString()}</Typography>
          <IconButton onClick={selectNextDay}><ArrowForwardIcon/></IconButton>
        </Box>
        { selectedDay.date && <WateringDetailDrawer date={selectedDay.date} onDrawerClose={() => setDrawerWateringDay( false )}/> }
      </Drawer>
    </>
  )
}

const useStyles = makeStyles(( theme ) => ( {
  drawerToolbar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText( theme.palette.primary.main )
  },
  dayContainer: {
    '&.notInPeriod': {
      '& .dayInMonth': {
        backgroundColor: '#AAAAAA',
      }
    },
    '&.active': {
      backgroundColor: 'rgba(180, 180, 180, 0.26)',
      fontWeight: 'bold',
      '& h4': {
        fontWeight: 'bold'
      }
    },
    display: 'flex',
    flexDirection: 'column',
    width: '48px',
    borderRadius: '4px',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 0,
    '&> *': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      height: '44px',
      width: '44px',
      borderRadius: '4px',
      '&.dayInMonth': {
        backgroundColor: '#BDE3DC',
        '&.droughtrisk1': {
          backgroundColor: '#F6E6A2'
        },
        '&.droughtrisk2': {
          backgroundColor: '#FFBD4A'
        }
      }
    }
  },
  weekContainer: {}
} ))

export default WateringCalendarWeek
