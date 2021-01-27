import {gql, useQuery} from '@apollo/client'
import {Box, Container, IconButton, Link, makeStyles, Theme, Typography} from '@material-ui/core'
import {
  ChevronLeft as ArrowBackIcon, ChevronRight as ArrowForwardIcon
} from '@material-ui/icons'
import {DefaultTheme} from '@material-ui/styles'
import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {equalsNeo4jDate, fromNeo4JDate, toNeo4JDate} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDate, WateringPeriod, WateringTask} from '../../types/graphql'
import {BottomDrawer, CornerBadge} from '../basic'
import { ItsMyTurnIcon,IWillHelpIcon} from './icons'
import {WateringDetailDrawer} from './WateringDetailDrawer'

interface WateringDayProps {
  date: Date;
  recruiterCount: number;
  onSelect?: Function;
  active?: boolean;
  notInPeriod?: boolean;
  itsMyTurn?: boolean;
  optimalRecruiterCount?: number;
  size?: number;
}

interface WateringDayStylesProps {
  recruiterMissingCount: number;
  active?: boolean;
  size: number;
}

const WateringDay = ( {date, recruiterCount, optimalRecruiterCount = 3, size = 60, onSelect, active, notInPeriod, itsMyTurn}: WateringDayProps ) => {
  const d = dayjs( date )
  const classes = useWateringDayStyles( {
    recruiterMissingCount: optimalRecruiterCount - recruiterCount,
    active, size} )

  return (
    <Link underline='none' onClick={() => onSelect && onSelect()} component="button">
      <div className={`${classes.dayContainer} ${active && 'active'} ${notInPeriod && 'notInPeriod'}`}>
        <CornerBadge className={classes.badge} cornerActive={itsMyTurn}>
          <div className='badgeContent'>
            <Typography variant="h6">{d.format( 'dd' )}</Typography>
            <Typography variant="body1">{d.format( 'DD.M.' )}</Typography>
          </div>
        </CornerBadge>
      </div>
    </Link>
  )
}

const useWateringDayStyles = makeStyles<Theme, WateringDayStylesProps>(( theme ) => ( {
  badge: {
    backgroundColor: ( {recruiterMissingCount} ) => (
      recruiterMissingCount >= 2
        ? '#FFBD4A'
        : ( recruiterMissingCount === 2
          ? '#F6E6A2'
          : '#BDE3DC' )
    )},
  dayContainer:  {
    padding: '8px',
    height: ( {size} ) => `${size +  20}px`,
    '& .badgeContent': {
      transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, height 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      width: ( {size, active} ) => `${size + ( active ? 20 : 0 )}px`,
      height: ( {size, active} ) => `${size + ( active ? 20 : 0 )}px`,
    },
    color: theme.palette.grey['800'],
    fontWeight: ( {active} ) => active ? 'bold' : 'normal',
    '& h6': {
      fontWeight: ( {active} ) => active ? 'bold' : 'normal',
    }
  }
} ))

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
      const { WateringPeriod: [ {from , till} ] } = wateringPeriodData
      return {
        from,
        till
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
      <Box display="flex" flexDirection="row" margin='16px'>
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
      <BottomDrawer
        open={drawerWateringDay}
        onClose={() => setDrawerWateringDay( false )}
        toolbar={(
          <>
            <IconButton onClick={selectPreviousDay}><ArrowBackIcon/></IconButton>
            <Typography variant="h4">{selectedDay && selectedDay.date?.toLocaleDateString()}</Typography>
            <IconButton onClick={selectNextDay}><ArrowForwardIcon/></IconButton>
          </> )}>
        { selectedDay.date && <WateringDetailDrawer date={selectedDay.date} onDrawerClose={() => setDrawerWateringDay( false )}/> }
      </BottomDrawer>
    </>
  )
}


export default WateringCalendarWeek
