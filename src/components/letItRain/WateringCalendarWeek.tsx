import {gql, useQuery} from '@apollo/client'
import {IconButton, Typography} from '@material-ui/core'
import {
  ChevronLeft as ArrowBackIcon, ChevronRight as ArrowForwardIcon
} from '@material-ui/icons'
import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'
import React, {useEffect, useRef, useState} from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import {useSelector} from 'react-redux'
import {useResizeObserver} from 'react-resize-observer-hook'

import {equalsNeo4jDate, toNeo4JDate} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDate, WateringTask} from '../../types/graphql'
import {BottomDrawer} from '../basic'
import {WateringCalendarTaskItem} from './WateringCalendarTaskItem'
import {WateringDetailDrawer} from './WateringDetailDrawer'

interface WateringCalendarWeekProps {
  startDate: Date;
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
const WateringCalendarWeek = ( {startDate, defaultDayCount = 7 }: WateringCalendarWeekProps ) => {
  const [selectedDay, selectDay] = useState<{index: number,date?: Date}>( { index: -1 } )
  const [dayCount, setDayCount] = useState( 7 )
  const [drawerWateringDay, setDrawerWateringDay] = useState<boolean>( false )
  const {data: wateringTasksData} = useQuery<{WateringTask: WateringTask[]}, { dateFrom: _Neo4jDate, dateTo: _Neo4jDate}>( GET_WATERING_TASKS, {
    variables: {
      dateFrom: toNeo4JDate( startDate ),
      dateTo: toNeo4JDate( dayjs( startDate ).add( dayCount - 1 , 'day' ).toDate())
    }
  } )
  const defaultCalendarDates = ( c: number, d: Date ) => [...Array( dayCount )]
    .map(( _, i ) => dayjs( d ).add( i, 'day' ))
    .map(( date ) => ( {
      date,
      iAmAvailable: false,
      itsMyTurn: false,
      recruiterCount: 0,
      inPeriod: false
    } ))
  const [calendarDates, setCalendarDates] = useState( defaultCalendarDates( dayCount, startDate ))
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )

  const outerDiv = useRef( null )
  useResizeObserver( outerDiv,
    ( {width} ) => {
      try {
        setDayCount( prev => {
          const v = Math.floor( width / 60 ) + defaultDayCount
          return v > prev ? v : prev
        } )
      } catch ( e ){
        console.log( e )}
    } )


  useEffect(() => {
    if( !wateringTasksData ) {
      setCalendarDates( defaultCalendarDates( dayCount, startDate ))
    } else {
      const wateringtasks = wateringTasksData?.WateringTask

      setCalendarDates(
        [...Array( dayCount )]
          .map(( _, i ) => dayjs( startDate ).add( i, 'day' ))
          .map( date => {
            const task = ( wateringtasks || [] ).find( t => t && equalsNeo4jDate( t.date, date.toDate()))
            return {
              date,
              itsMyTurn: ( task?.users_assigned || [] ).findIndex(( user ) => user && userProfile?.username === user.label ) >= 0 ,
              iAmAvailable: ( task?.users_available || [] ).findIndex(( user ) => user && userProfile?.username === user.label ) >= 0 ,
              recruiterCount: task?.users_assigned?.length || 0,
              inPeriod: !!( task?.wateringperiod?.[0]?.hasUsersAssigned )
            }
          } ))

    }
  }, [startDate, wateringTasksData] )

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
    i >= 0 && selectDay( prev => ( {index: i, date: dayjs( prev.date ).subtract( 1, 'day' ).toDate()} ))
  }

  const selectNextDay = () => {
    const i = selectedDay.index + 1
    i < dayCount && selectDay(  prev => ( {index: i, date: dayjs( prev?.date ).add( 1, 'day' ).toDate()} ))
  }

  const handleTaskSelected = ( active: boolean ,ref: HTMLElement | null ) => {
    active && ref?.scrollIntoView( {
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    } )
  }

  return (
    <div ref={outerDiv}>
      <ScrollContainer className={'container'} horizontal style={{height: '100px', width: '100%', whiteSpace: 'nowrap'}}>
        {calendarDates.map(( { date, recruiterCount, inPeriod, itsMyTurn, iAmAvailable }, i ) => (
          <WateringCalendarTaskItem
            onSelect={() => select( i, date.toDate())}
            active={selectedDay.index === i}
            onActivate={handleTaskSelected}
            key={date.toISOString()}
            date={date.toDate()}
            recruiterCount={recruiterCount}
            inPeriod={inPeriod}
            cornerActive={iAmAvailable || itsMyTurn}
          />
        ))}
      </ScrollContainer>
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
    </div>
  )
}


export default WateringCalendarWeek
