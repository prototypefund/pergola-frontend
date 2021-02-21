import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup, FormHelperText, Input, InputLabel,
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
    <FormGroup row={true} className={classes.formGroup}>
      {checked && <FormControl>
        <Input classes={{ input: classes.numberInput }} type='number' value={number} onChange={handleNumberChange}/>
      </FormControl>}
      <FormControlLabel
        labelPlacement='start'
        label={checked ? ( number > 1 ? labelCheckedPlural : labelCheckedSingular ) : labelUnchecked}
        control={<Checkbox checked={checked} onChange={event => setChecked( event.target.checked )}/>}
      />
    </FormGroup>
  )

}

export function NotificationSettings() {
  const classes = useStyles()
  const [mailChecked, setMailChecked] = useState(false)
  const [pushChecked, setPushChecked] = useState(false)
  const [rememberChecked, setRememberChecked] = useState(false)

  return (
    <Box flexGrow="1">
      <Typography variant="h3" align="center">Wie sollen wir dich erinnern?</Typography>
      <Box my={3}>
        <FormGroup row={true} className={classes.box}>
          <FormControlLabel
            labelPlacement='start'
            label="Per E-Mail"
            control={<Checkbox onChange={event => setMailChecked( event.target.checked )} />}
          />
          <FormControlLabel
            labelPlacement='start'
            label="Per Push-Nachricht"
            control={<Checkbox onChange={event => setPushChecked( event.target.checked )} />}
          />
        </FormGroup>
        { ( mailChecked || pushChecked ) &&
          <Box className={classes.box}>
            <CheckboxNumberFormControl labelUnchecked='Vor jedem Einsatz' labelCheckedSingular='Tag vor jedem Einsatz' labelCheckedPlural='Tage vor dem Einsatz'/>
            <CheckboxNumberFormControl labelUnchecked='Vor jeder Woche' labelCheckedSingular='Tag vor jeder Woche' labelCheckedPlural='Tage vor  jeder Woche'/>
          </Box>
        }
      </Box>
      <FormControlLabel
        label="In Profileinstellungen übernehmen"
        control={<Checkbox onChange={event => setRememberChecked( event.target.checked )} />}
      />
    </Box>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  box: {
    marginBottom: '1rem',
    padding: '.5rem 1rem',
    backgroundColor: theme.palette.grey['200'],
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    textAlign: 'right',
    justifyContent: 'flex-end'
  },
  formGroup: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  numberInput: {
    width: '40px',
    textAlign: 'center',
  }
} ))
