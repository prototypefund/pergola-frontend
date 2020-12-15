import { Checkbox, FormGroup, FormLabel, IconButton } from '@material-ui/core'
import { Check, Remove } from '@material-ui/icons'
import React, { useState } from 'react'

export function Calendar() {
  const [state, setState] = React.useState( {} )
  const [weekCheckState, setWeekCheckState] = useState( {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  } )

  // TODO: Datum auslesen
  const weeks = [
    { cw: 44, disabled: true },
    { cw: 45 },
    { cw: 46 },
    { cw: 47 },
  ]

  const weekDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  const handleDayChange = ( event ) => {
    setState( { ...state, [event.target.name]: event.target.checked } )
  }

  const handleWeekDayChange = ( index: number, weekDay: string ) => {
    const daysToSelect = {}
    const checkAll = !!weekCheckState[weekDay]
    setWeekCheckState( { ...weekCheckState, [weekDay]: !checkAll } )
    weeks.forEach(( week ) => {
      if ( week.disabled ) return
      const boxKey = checkBoxKey( week.cw, index )
      daysToSelect[boxKey] = checkAll
    } )
    setState( { ...state, ...daysToSelect } )
  }

  const checkBoxKey = ( cw: number, dayOfWeek: number ) => {
    return 'box-' + cw + '-' + dayOfWeek
  }

  return (
    <div>
      <FormGroup row>
        <FormLabel component="legend">Weekday</FormLabel>
        {weekDays.map(( day, index ) => (
          <IconButton
            key={index}
            name={index.toString()}
            onClick={() => handleWeekDayChange( index, day )}
          >
            {weekCheckState[day.toLowerCase()] ? <Check /> : <Remove />}
          </IconButton>
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
