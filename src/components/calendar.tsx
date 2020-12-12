import { Checkbox, FormGroup, FormLabel } from '@material-ui/core'
import React from 'react'

export function Calendar() {
  const [state, setState] = React.useState( {} )

  // TODO: Datum auslesen
  const weeks = [{ cw: 44, disabled: true }, { cw: 45 }, { cw: 46 }]

  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  const handleDayChange = ( event ) => {
    setState( { ...state, [event.target.name]: event.target.checked } )
  }

  const handleWeekDayChange = ( event ) => {
    const daysToSelect = []
    weeks.map(( week ) => {
      daysToSelect[checkBoxKey( week.cw, event.target.name )] =
        event.target.checked
      console.log(
        checkBoxKey( week.cw, event.target.name ) + ': ' + event.target.checked
      )
      // setState( { [checkBoxKey( week.cw, event.target.name )]: event.target.checked } )
      // TODO: Warum wird immer nur diee letzte KW beachtet?
      setState( {
        ...state,
        [checkBoxKey( week.cw, event.target.name )]: event.target.checked,
      } )
      console.log( state )
    } )
    // setState( daysToSelect )
  }

  const checkBoxKey = ( cw: number, dayOfWeek: number ) => {
    return cw + '-' + dayOfWeek
  }

  return (
    <div>
      <FormGroup row>
        <FormLabel component="legend">Weekday</FormLabel>
        {weekDays.map(( day, index ) => (
          <Checkbox
            key={index}
            inputProps={{ 'aria-label': day }}
            name={index.toString()}
            onChange={handleWeekDayChange}
          />
        ))}
      </FormGroup>
      {weeks.map(( week, index ) => (
        <FormGroup key={index} row>
          <FormLabel component="legend">CW {week.cw}</FormLabel>
          {weekDays.map(( day, index ) => (
            <Checkbox
              key={index}
              inputProps={{ 'aria-label': day }}
              name={checkBoxKey( week.cw, index )}
              checked={state[checkBoxKey( week.cw, index )] || false}
              onChange={handleDayChange}
              disabled={week.disabled}
            />
          ))}
        </FormGroup>
      ))}
    </div>
  )
}
