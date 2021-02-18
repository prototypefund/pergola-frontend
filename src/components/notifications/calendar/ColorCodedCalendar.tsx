import '../../../css/rsuite.scss'
import './colorCodedCalendar.scss'

import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Calendar } from 'rsuite'

import { CalDav, getEventsOfDay } from './CalDav'

function formatTimePeriod( event ) {
  const from = event.startDate.toJSDate()
  const till = event.endDate?.toJSDate()
  return dayjs( from ).format( 'HH:mm' )
         + ( till && dayjs( till ).isAfter( dayjs( from )) ? dayjs( till ).format( ' - HH:mm' ) : '' )
	 + ' Uhr'
}

/** a renderer to display availabilities of wateringTasks **/
function renderCell( date: Date, jcalData = undefined ) {
  const events = getEventsOfDay( date, jcalData )
  return events.map(( event ) => {
    const color = event.component.getFirstPropertyValue( 'x-pergola-color' ) || 'grey'
    return (
      <div className='colorCodedCalendarEntry' key={event.uid}
        style={{ background: color, width: ( Math.floor( 100/events.length )).toString()+'%' }}>
        <p> {event.summary} </p>
      </div>
    )
  } )
}

export function DayOverview( {date, events} ) {
  return (
    <div className={'dayOverview'}>
      <h3> {dayjs( date ).format( 'LL' )} </h3>
      <table>
        <tbody>
          { events.map( event => {
            const color = event.component.getFirstPropertyValue( 'x-pergola-color' ) || 'grey'

            return (
              <tr key={event.uid}>
                <td style={{background: color}}> &nbsp; </td>
                <td> {formatTimePeriod( event )} </td>
                <td> {event.summary} </td>
              </tr>
            )} )}
        </tbody>
      </table>
    </div>
  )
}

/** A component implementing the Calendar View proposed at https://github.com/community-garden/pergola-fullstack/issues/55 **/
export function ColorCodedCalendar( {jcalData}:any ) {
  const [date, setDate] = useState( new Date())

  return (
    <div className='rsuite'>
      <Calendar
        bordered compact isoWeek={true}
        renderCell={ ( date:Date ) => renderCell( date, jcalData ) }
        onChange={setDate}  />
      <DayOverview date={date} events={getEventsOfDay( date, jcalData )} />
    </div>
  )
}

export function PersonalCalendar() {
  return (
    <>
      <CalDav root={process.env.WEBDAV_URL || 'http://localhost:4001/calendar'}
        path={'/public/example.ics'} >
        <ColorCodedCalendar />
      </CalDav>
    </>
  )
}
