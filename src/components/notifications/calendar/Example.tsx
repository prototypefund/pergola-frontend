import * as React from 'react'
import { Calendar } from 'rsuite'
import 'rsuite/dist/styles/rsuite-default.css'
import { CalDav, getEventsOfDay } from './CalDav'

/** a renderer to display availabilities of wateringTasks **/
function renderCell(date:Date, jcalData=undefined) {
  const events = (getEventsOfDay(date, jcalData))
  return events.map(event => {
    const assignees = event.component.getFirstPropertyValue('x-pergola-watering-assigned-count')
    const color = {0:'#FFBD4A',1:'#F6E6A2'}[assignees] || '#BDE3DC'
    return (<div key={event.uid} style={{background: color}}>{event.summary}</div>)})
}

export function ExampleCalendar() {
  return (
    <CalDav root={'http://localhost:4001/calendar'} path={'/public/wateringTasks.ics'}>
      <Calendar bordered renderCell={renderCell} isoWeek={true} />
    </CalDav>
  )
}
