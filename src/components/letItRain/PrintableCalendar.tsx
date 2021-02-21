import '../../css/rsuite.scss'

import {gql, useQuery} from '@apollo/client'
import dayjs from 'dayjs'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import {Calendar} from 'rsuite'

import {fromNeo4jDate, stringToHSL, toNeo4jDateInput} from '../../helper'
import {_Neo4jDateInput, WateringTask} from '../../types/graphql'

const GET_WATERING_TASKS = gql`
    query WateringTask($gardenId: ID!, $dateFrom: _Neo4jDateInput, $dateTo: _Neo4jDateInput) {
        WateringTask(filter:
        { AND: [
            { wateringperiod: { at: {gardenId: $gardenId } } }
            { date_gte: $dateFrom },
            { date_lte: $dateTo } ]
        }) {
            date { day month year}
            users_assigned { label }
            users_available { label }
        }
    }
`
interface Props {
  childRef?: React.Ref<HTMLDivElement>
}

export function PrintableCalendar( { childRef } : Props ) {
  const startDate = dayjs().startOf( 'month' ).toDate()
  const endDate = dayjs().endOf( 'month' ).toDate()
  const { gardenId } = useParams<{gardenId: string}>()

  const {data: WateringTasksData} = useQuery<{WateringTask: WateringTask[]}, {gardenId: string, dateFrom: _Neo4jDateInput, dateTo: _Neo4jDateInput}>( GET_WATERING_TASKS, {
    variables: {
      gardenId,
      dateFrom: toNeo4jDateInput( startDate ),
      dateTo: toNeo4jDateInput( endDate  )
    }
  } )

  const renderCell = ( cellDate: Date ) => {
    const task = WateringTasksData?.WateringTask?.find(( {date} ) => dayjs( cellDate ).isSame( fromNeo4jDate( date ), 'day' ))
    const users =  task?.users_assigned || []
    return users.map( user => user && (
      <div key={cellDate.toISOString() + user.label} style={{color: stringToHSL( user.label )}}>{user.label}</div>
    ))

  }

  return (
    <div ref={childRef} className='rsuite'>
      <style>
        {'@media print {.rs-calendar-header-forward, .rs-calendar-header-backward, .rs-calendar-btn-today {display: none} .rs-calendar-panel .rs-calendar-table-cell-selected .rs-calendar-table-cell-content {border: none;}.rs-calendar-panel .rs-calendar-table-cell-is-today .rs-calendar-table-cell-day{color: inherit; background: none;}}' }
      </style>
      <Calendar bordered renderCell={renderCell} />
    </div>
  )
}

