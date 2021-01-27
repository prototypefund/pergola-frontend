import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup, Input, InputLabel,
  makeStyles,
  Switch,
  Theme,
  Typography
} from '@material-ui/core'
import * as React from 'react'
import {useState} from 'react'

interface CheckboxNumberFormControlProps {
  className?: string;
  labelUnchecked: string;
  labelCheckedSingular: string;
  labelCheckedPlural?: string;
  defaultChecked?: boolean;
  defaultNumber?: number;
}

function CheckboxNumberFormControl( {className, labelUnchecked, labelCheckedSingular, labelCheckedPlural = labelCheckedSingular, defaultChecked = false, defaultNumber = 1}: CheckboxNumberFormControlProps ) {
  const classes = useStyles()
  const [checked, setChecked] = useState( defaultChecked )
  const [number, setNumber] = useState( defaultNumber )

  const handleNumberChange = ( { target: { value }} ) => {
    const _val = parseInt( value )
    if( _val> 0 ) {
      setNumber( _val )
    }
  }

  return (
    <FormGroup row className={className}>
      {checked && <FormControl>
        <Input style={{width: '2em' }}  type='number' value={number} onChange={handleNumberChange}/>
      </FormControl>}
      <FormControlLabel
        className={classes.boxedSwitch + ' ' + classes.boxed}

        labelPlacement='start'
        label={checked ? ( number > 1 ? labelCheckedPlural : labelCheckedSingular ) : labelUnchecked}
        control={<Switch id='switch' checked={checked} onChange={event => setChecked( event.target.checked )}/>}
      />
    </FormGroup>
  )

}

export function NotificationSettings() {
  const classes = useStyles()

  return (
    <div>
      <Box className={classes.form} display='flex' flexDirection='column' width='100%'>
        <FormGroup className={classes.boxed} style={{padding: '8px'}}  row>
          <FormControlLabel
            control={<Checkbox/>}
            label={'per Email'}
          />
          <FormControlLabel
            control={<Checkbox/>}
            label={'per Push-Nachricht'}

          />
        </FormGroup>
        <CheckboxNumberFormControl
          labelUnchecked='vor jedem Einsatz' labelCheckedSingular='Tag vor dem Einsatz' labelCheckedPlural='Tage vor dem Einsatz'/>
        <CheckboxNumberFormControl
          labelUnchecked='vor jeder Woche' labelCheckedSingular='Tag vor jeder Woche' labelCheckedPlural='Tage vor  jeder Woche'/>

      </Box>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  form: {
    '& > *': {
      justifyContent: 'space-between',
      margin: '8px',
    }
  },
  boxed: {
    backgroundColor: theme.palette.grey['200'],
    borderRadius: '4px',
  },
  boxedSwitch: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: '8px'
  }
} ))
