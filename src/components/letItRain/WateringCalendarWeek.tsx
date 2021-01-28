import {gql, useQuery} from '@apollo/client'
import {Box, IconButton, Typography} from '@material-ui/core'
import {
  ChevronLeft as ArrowBackIcon, ChevronRight as ArrowForwardIcon
} from '@material-ui/icons'
import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {equalsNeo4jDate, toNeo4JDate} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDate, WateringTask} from '../../types/graphql'
import {BottomDrawer} from '../basic'
import {WateringCalendarTaskItem} from './WateringCalendarTaskItem'
import {WateringDetailDrawer} from './WateringDetailDrawer'

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
        wateringperiod {
            hasUsersAssigned
            from { day month year }
            till { day month year }
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
        {calendarDates.map(( { date, recruiterCount, inPeriod, itsMyTurn, iAmAvailable }, i ) => (
          <WateringCalendarTaskItem
            onSelect={() => select( i, date.toDate())}
            active={selectedDay.index === i}
            key={date.toISOString()}
            date={date.toDate()}
            recruiterCount={recruiterCount}
            inPeriod={inPeriod}
            cornerActive={iAmAvailable || itsMyTurn}
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
