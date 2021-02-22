import {gql, useQuery, useSubscription} from '@apollo/client'
import {Box, IconButton, Typography} from '@material-ui/core'
import {
  ChevronLeft as ArrowBackIcon, ChevronRight as ArrowForwardIcon
} from '@material-ui/icons'
import {useKeycloak} from '@react-keycloak/web'
import dayjs from 'dayjs'
import React, {useEffect, useRef, useState} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import ScrollContainer from 'react-indiana-drag-scroll'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'

import {nextDay, previousDay, selectDay} from '../../actions'
import {equalsNeo4jDate, toNeo4jDateInput} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDateInput, WateringTask} from '../../types/graphql'
import {toWateringTaskInfo, WateringTaskInfo} from './helper'
import {WateringCalendarTaskItem} from './WateringCalendarTaskItem'

interface WateringCalendarWeekProps {
  preselectedDate: Date;
  defaultDayCount?: number;
  onNextPageRequested?: () => any;
  onPrevPageRequested?: () => any;
}
const GET_WATERING_TASKS = gql`
query WateringTask($gardenId: ID!, $dateFrom: _Neo4jDateInput, $dateTo: _Neo4jDateInput) {
    WateringTask(filter:
    { AND: [
        { wateringperiod: { at: {gardenId: $gardenId } } }
        { date_gte: $dateFrom },
        { date_lte: $dateTo } ]
    }) {
        _id
        date { day month year}
        users_assigned { _id id label }
        users_available { _id id label }
        wateringperiod {
            _id
            hasUsersAssigned
            from { day month year }
            till { day month year }
        }
    }
}
`


const WATERING_TASK_CHANGE = gql`
    subscription {
        WateringTaskChange
    }
`

const WateringCalendarWeek = ( {preselectedDate, defaultDayCount = 7 }: WateringCalendarWeekProps ) => {

  const dispatch = useDispatch()
  const { keycloak: { subject: userId } } = useKeycloak()
  const { gardenId } = useParams<{gardenId: string}>()
  const selectedDay = useSelector<RootState, Date | undefined | null>(( {letItRain: { selectedDate}} ) => selectedDate ) || preselectedDate
  const [dayCount, setDayCount] = useState( 45 )
  const [scrollBehavior, setScrollBehavior] = useState<'auto' | 'smooth'>( 'auto' )
  const [{ startDate, endDate}, setTimeWindow] = useState( {
    startDate:  dayjs( preselectedDate ).subtract( dayCount, 'day' ).toDate(), endDate: dayjs( preselectedDate ).add( dayCount, 'day' ).toDate() } )
  const {data: wateringTasksData, refetch, loading } = useQuery<{WateringTask: WateringTask[]}, {gardenId: string, dateFrom: _Neo4jDateInput, dateTo: _Neo4jDateInput}>( GET_WATERING_TASKS, {
    variables: {
      gardenId,
      dateFrom: toNeo4jDateInput( startDate ),
      dateTo: toNeo4jDateInput( endDate  )
    }
  } )

  const { data: WateringTaskChangeData } = useSubscription<{WateringtaskChange: Boolean}>( WATERING_TASK_CHANGE )
  useEffect(() => {WateringTaskChangeData &&  wateringTasksData && !loading && refetch() }, [WateringTaskChangeData] )


  const defaultCalendarDates = ( _startDate: Date, _endDate: Date ) => [...Array( Math.abs( dayjs( _startDate ).diff( _endDate, 'day' )))]
    .map(( _, i ) => dayjs( startDate ).add( i, 'day' ))
    .map(( date ) => ( {
      date,
      iAmAvailable: false,
      itsMyTurn: false,
      recruiterCount: 0,
      inPlannedPeriod: false,
      inPeriod: false
    } ))
  const [calendarDates, setCalendarDates] = useState<WateringTaskInfo[]>( defaultCalendarDates( startDate, endDate ))

  const outerDiv = useRef( null )
  /*useEffect(() => {
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


  outerDiv && useResizeObserver( outerDiv,
    ( {width} ) => {
      setDayCount( prev => {
        const v = Math.floor( width / 60 ) + defaultDayCount
        return v > prev ? v : prev
      } )
    } )*/


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
              ...toWateringTaskInfo( task,  userId ),
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



  return (
    <div ref={outerDiv}>
      <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' mb={1}>
        <IconButton onClick={selectPreviousDay}><ArrowBackIcon/></IconButton>
        <Typography variant='body1' style={{width: '100%', textAlign: 'center'}}>
          {selectedDay && dayjs( selectedDay ).format( 'dddd, DD. MMMM' ) + ( dayjs( selectedDay ).isSame( new Date(), 'day' ) ? ' (heute)' : '' )}
        </Typography>
        <IconButton onClick={selectNextDay}><ArrowForwardIcon/></IconButton>
      </Box>
      <ScrollContainer className={'container'} horizontal style={{height: '100px', width: '100%', whiteSpace: 'nowrap'}}>
        <Box display='flex' flexDirection='row' alignItems='baseline' minHeight={'80px'}>
          {calendarDates.map(( { date, recruiterCount, inPlannedPeriod, inPeriod, itsMyTurn, iAmAvailable } ) => (
            <WateringCalendarTaskItem
              disabled={dayjs().startOf( 'day' ).isAfter( date ) || !inPeriod}
              onSelect={() => select( date.toDate())}
              active={selectedDay && date.isSame( selectedDay, 'day' )}
              onActivate={() =>  setScrollBehavior( 'smooth' )}
              scrollBehavior={scrollBehavior}
              key={date.toISOString()}
              date={date.toDate()}
              recruiterCount={recruiterCount}
              inPlannedPeriod={inPlannedPeriod}
              cornerActive={iAmAvailable || itsMyTurn}
            />
          ))}

        </Box>
      </ScrollContainer>
    </div>
  )
}


export default WateringCalendarWeek
