import {gql, useQuery} from '@apollo/client'
import {Box, IconButton, Paper, Typography} from '@material-ui/core'
import {
  ChevronLeft as ArrowBackIcon, ChevronRight as ArrowForwardIcon
} from '@material-ui/icons'
import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'
import React, {useEffect, useRef, useState} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import ScrollContainer from 'react-indiana-drag-scroll'
import {useDispatch, useSelector} from 'react-redux'
import {useResizeObserver} from 'react-resize-observer-hook'

import {nextDay, previousDay, selectDay} from '../../actions'
import {equalsNeo4jDate, toNeo4JDate} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDate, WateringTask} from '../../types/graphql'
import {toWateringTaskInfo} from './helper'
import {WateringCalendarTaskItem} from './WateringCalendarTaskItem'
import {WateringDetailDrawer} from './WateringDetailDrawer'

interface WateringCalendarWeekProps {
  preselectedDate: Date;
  defaultDayCount?: number;
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
        wateringperiod {
            hasUsersAssigned
            from { day month year }
            till { day month year }
        }
    }
}
`
const WateringCalendarWeek = ( {preselectedDate, defaultDayCount = 7 }: WateringCalendarWeekProps ) => {

  const dispatch = useDispatch()
  const selectedDay = useSelector<RootState, Date | undefined>(( {letItRain: { selectedDate= preselectedDate }} ) => selectedDate )
  const [dayCount, setDayCount] = useState( 7 )
  const [{ startDate, endDate}, setTimeWindow] = useState( {
    startDate:  dayjs( preselectedDate ).subtract( dayCount, 'day' ).toDate(), endDate: dayjs( preselectedDate ).add( dayCount, 'day' ).toDate() } )
  const {data: wateringTasksData} = useQuery<{WateringTask: WateringTask[]}, { dateFrom: _Neo4jDate, dateTo: _Neo4jDate}>( GET_WATERING_TASKS, {
    variables: {
      dateFrom: toNeo4JDate( startDate ),
      dateTo: toNeo4JDate( endDate  )
    }
  } )


  const defaultCalendarDates = ( _startDate: Date, _endDate: Date ) => [...Array( Math.abs( dayjs( _startDate ).diff( _endDate, 'day' )))]
    .map(( _, i ) => dayjs( startDate ).add( i, 'day' ))
    .map(( date ) => ( {
      date,
      iAmAvailable: false,
      itsMyTurn: false,
      recruiterCount: 0,
      inPeriod: false
    } ))
  const [calendarDates, setCalendarDates] = useState( defaultCalendarDates( startDate, endDate ))
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )

  useEffect(() => {
    setTimeWindow( prev => {
      const start = dayjs( selectedDay ).subtract( dayCount, 'day' )
      const end = dayjs( selectedDay ).add( dayCount, 'day' )
      const tw = {
        startDate: ( start.isBefore( prev.startDate ) && start.diff( prev.startDate, 'day' ) < -4 )? start.toDate() : prev.startDate,
        endDate: ( end.isAfter( prev.endDate )  && end.diff( prev.endDate, 'day' ) > 4  ) ? end.toDate() : prev.endDate
      }
      return tw
    } )
  }, [selectedDay, dayCount] )


  const outerDiv = useRef( null )
  useResizeObserver( outerDiv,
    ( {width} ) => {
      setDayCount( prev => {
        const v = Math.floor( width / 60 ) + defaultDayCount
        return v > prev ? v : prev
      } )
    } )


  useEffect(() => {
    if( !wateringTasksData ) {
      setCalendarDates( defaultCalendarDates( startDate, endDate ))
    } else {
      const wateringtasks = wateringTasksData?.WateringTask

      setCalendarDates(
        [...Array( Math.abs( dayjs( startDate ).diff( endDate, 'day' ))) ]
          .map(( _, i ) => dayjs( startDate ).add( i, 'day' ))
          .map( date => {
            const task = ( wateringtasks || [] ).find( t => t && equalsNeo4jDate( t.date, date.toDate()))
            return {
              ...toWateringTaskInfo( task, userProfile || undefined ),
              date
            }
          } ))

    }
  }, [startDate, endDate, wateringTasksData] )

  const select = ( date: Date ) => {
    dispatch( selectDay( date ))
  }

  const selectPreviousDay = () => {
    dispatch( previousDay())
  }

  const selectNextDay = () => {
    dispatch( nextDay())
  }

  useHotkeys( 'left', () => selectPreviousDay())
  useHotkeys( 'right', () => selectNextDay())

  const handleTaskSelected = ( active: boolean ,ref: HTMLElement | null ) => {
    setTimeout(() => {
      active && ref?.scrollIntoView( {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      } )
    }, 10 )
  }


  return (
    <div ref={outerDiv}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <IconButton onClick={selectPreviousDay}><ArrowBackIcon/></IconButton>
        <Typography variant='h4' style={{width: '100%', textAlign: 'center'}}>
          {selectedDay && dayjs( selectedDay ).format( 'dd, DD. MMMM YYYY' ) + ( dayjs( selectedDay ).isSame( new Date(), 'day' ) ? ' (heute)' : '' )}
        </Typography>
        <IconButton onClick={selectNextDay}><ArrowForwardIcon/></IconButton>
      </Box>
      <ScrollContainer className={'container'} horizontal style={{height: '100px', width: '100%', whiteSpace: 'nowrap'}}>
        <Box display='flex' flexDirection='row' alignItems='baseline' minHeight={'80px'}>
          {calendarDates.map(( { date, recruiterCount, inPeriod, itsMyTurn, iAmAvailable } ) => (
            <WateringCalendarTaskItem
              onSelect={() => select( date.toDate())}
              active={selectedDay && date.isSame( selectedDay, 'day' )}
              onActivate={handleTaskSelected}
              key={date.toISOString()}
              date={date.toDate()}
              recruiterCount={recruiterCount}
              inPeriod={inPeriod}
              cornerActive={iAmAvailable || itsMyTurn}
            />
          ))}

        </Box>
      </ScrollContainer>
    </div>
  )
}


export default WateringCalendarWeek
