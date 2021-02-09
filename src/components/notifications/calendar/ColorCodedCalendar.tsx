import 'rsuite/dist/styles/rsuite-default.css'

import React, { useState } from 'react'
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

export function DayOverview({date, events}) {
  return (
    <div className={'dayOverview'}>
      <h3> {date.toDateString()} </h3>
      <table>
        <tbody>
          { events.map(event => (
            <tr key={event.uid}>
              <td> {event.from} </td>
              <td> {event.summary} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** A component implementing the Calendar View proposed at https://github.com/community-garden/pergola-fullstack/issues/55 **/
export function ColorCodedCalendar( {jcalData}:any ) {
  const [date, setDate] = useState(new Date())

  return (
    <>
      <Calendar bordered compact isoWeek={true}
                renderCell={ (date:Date) => renderCell(date, jcalData) }
		onChange={setDate}  />
      <DayOverview date={date} events={getEventsOfDay( date, jcalData )} />
    </>
  )
}

export function PersonalCalendar() {
  return (
    <>
      <CalDav root={process.env.WEBDAV_URL || 'http://localhost:4001/calendar'}
              path={'/public/wateringTasks.ics'} >
        <ColorCodedCalendar />
      </CalDav>
    </>
  )
}
