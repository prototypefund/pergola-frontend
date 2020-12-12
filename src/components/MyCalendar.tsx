import { Checkbox, FormGroup, FormLabel } from '@material-ui/core'
import React from 'react'

interface Props {
  dates: Array<Date>;
}

export function MyCalendar( { dates }: Props ) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  function getWeekNumber( date: Date ) {
    date.setHours( 0, 0, 0, 0 )
    // Thursday in current week decides the year.
    date.setDate( date.getDate() + 3 - (( date.getDay() + 6 ) % 7 ))
    // January 4 is always in week 1.
    const weekOne = new Date( date.getFullYear(), 0, 4 )
    // Adjust to thursday in week 1 and count number of weeks from date to weekOne.
    return (
      1 +
      Math.round(
        (( date.getTime() - weekOne.getTime()) / 86400000 -
          3 +
          (( weekOne.getDay() + 6 ) % 7 )) /
          7
      )
    )
  }

  const datesByWeeks = dates.reduce(( map, date ) => {
    const weekNumber = getWeekNumber( date )
    map.has( weekNumber ) || map.set( weekNumber, [] )

    map.get( weekNumber ).push( date )

    return map
  }, new Map())

  return (
    <div>
      {Array.from( datesByWeeks.values()).map(
        ( dates: Array<Date>, weekIndex: number ) => (
          <FormGroup row key={weekIndex}>
            <FormLabel component="legend">{weekIndex}</FormLabel>
            {dates.map(( date: Date, dateIndex: number ) => (
              <Checkbox
                key={weekIndex + '-' + dateIndex}
                name={date.toDateString()}
              />
            ))}
          </FormGroup>
        )
      )}
    </div>
  )
}
