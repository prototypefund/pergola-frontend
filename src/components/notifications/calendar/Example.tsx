import 'rsuite/dist/styles/rsuite-default.css'

import * as React from 'react'
import { Calendar } from 'rsuite'

import { CalDav, getEventsOfDay } from './CalDav'

/** a renderer to display availabilities of wateringTasks **/
function renderCell( date: Date, jcalData = undefined ) {
  const events = getEventsOfDay( date, jcalData )
  return events.map(( event ) => {
    const assignees = event.component.getFirstPropertyValue(
      'x-pergola-watering-assigned-count'
    )
    const color = { 0: '#FFBD4A', 1: '#F6E6A2' }[assignees] || '#BDE3DC'
    return (
      <div key={event.uid} style={{ background: color }}>
        {event.summary}
      </div>
    )
  } )
}

export function ExampleCalendar() {
  return (
    <>
      <style>
        {'@media print {.rs-calendar-header-forward, .rs-calendar-header-backward, .rs-calendar-btn-today {display: none} .rs-calendar-panel .rs-calendar-table-cell-selected .rs-calendar-table-cell-content {border: none;}.rs-calendar-panel .rs-calendar-table-cell-is-today .rs-calendar-table-cell-day{color: inherit; background: none;}}' }
      </style>
      <CalDav
        root={process.env.WEBDAV_URL || 'http://localhost:4001/calendar'}
        path={'/public/wateringTasks.ics'}
      >
        <Calendar bordered renderCell={renderCell} isoWeek={true} />
      </CalDav>
    </>
  )
}