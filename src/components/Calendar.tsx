import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Theme,
} from '@material-ui/core'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import React from 'react'

dayjs.extend( weekOfYear )

interface Props {
  dates: Date[];
  onChange?: ( dates: Date[] ) => void;
}

export function Calendar( { dates = [], onChange }: Props ) {
  const classes = useStyles()

  const [selectedDates, setSelectedDates] = React.useState<Date[]>( [] )

  const toggleDates = ( dates: Date[], selected: Boolean ) => {
    // remove or add given dates from selected dates
    const _selectedDates = selected
      ? [
        ...selectedDates,
        ...dates.filter(( date ) => !dateIncluded( selectedDates, date )),
      ]
      : selectedDates.filter(( date ) => !dateIncluded( dates, date ))
    setSelectedDates( _selectedDates )
    onChange?.( selectedDates )
  }

  const dateIncluded: ( dates: Date[], date: Date ) => boolean = (
    dates,
    date
  ) => {
    const dateStr = dayjs( date ).format( 'YYYY-MM-DD' )
    return dates.map(( d ) => dayjs( d ).format( 'YYYY-MM-DD' )).includes( dateStr )
  }

  const [firstDate] = dates
  const lastDate = dates[dates.length - 1]

  // TODO: Currently each calendar week needs 7 dates, otherwise we get wrong/missing checkboxes. How to fix this?
  const datesByWeeks = dates.reduce(( map, date ) => {
    const cw = dayjs( date ).week()
    map.has( cw ) || map.set( cw, [] )
    map.get( cw ).push( date )

    return map
  }, new Map())

  const handleAllChange = ( event ) => {
    // (un)check all dates
    const relatedDates: Date[] = []
    for ( const key of Object.keys( dates )) {
      const date = dates[key]
      relatedDates.push( date )
    }
    toggleDates( relatedDates, event.target.checked )
  }

  const handleDayChange = ( event, dayOfWeek: number ) => {
    // (un)check each date with same day
    const relatedDates: Date[] = []
    for ( const key of Object.keys( dates )) {
      const date = dates[key]
      if ( dayjs( date ).weekday() === dayOfWeek ) {
        relatedDates.push( date )
      }
    }
    toggleDates( relatedDates, event.target.checked )
  }

  const handleCwChange = ( event, cw: number ) => {
    // (un)check date of this calendar week
    const relatedDates: Date[] = []
    for ( const key of Object.keys( dates )) {
      const date = dates[key]
      const dateCW = dayjs( date ).week()
      if ( dateCW === cw ) {
        relatedDates.push( date )
      }
    }
    toggleDates( relatedDates, event.target.checked )
  }

  const handleDateChange = ( event, date: Date ) => {
    toggleDates( [date], event.target.checked )
  }

  const AllDatesChecked = (): boolean => {
    return !dates.some(( date ) => {
      return !dateIncluded( selectedDates, date )
    } )
  }

  const DayDatesChecked = ( dayOfWeek: number ): boolean => {
    return !dates.some(( date ) => {
      return (
        dayjs( date ).weekday() === dayOfWeek &&
        !dateIncluded( selectedDates, date )
      )
    } )
  }

  const CwDatesChecked = ( cw: number ): boolean => {
    return !dates.some(( date ) => {
      const dateCw = dayjs( date ).week()
      return dateCw === cw && !dateIncluded( selectedDates, date )
    } )
  }

  function AllCheckBox(): React.ReactElement<any, any> {
    return (
      <Checkbox
        classes={{
          root: classes.checkBox,
          checked: classes.checkBoxChecked,
        }}
        checkedIcon={<CheckBoxIcon checked />}
        icon={<CheckBoxIcon />}
        color="primary"
        onChange={handleAllChange}
        checked={AllDatesChecked()}
      />
    )
  }

  function DayCheckBox( props: {
    dayOfWeek: number;
  } ): React.ReactElement<any, any> {
    return (
      <Checkbox
        classes={{
          root: classes.checkBox,
          checked: classes.checkBoxChecked,
        }}
        checkedIcon={<CheckBoxIcon checked />}
        icon={<CheckBoxIcon />}
        color="primary"
        onChange={( e ) => handleDayChange( e, props.dayOfWeek )}
        checked={DayDatesChecked( props.dayOfWeek )}
      />
    )
  }

  function CwCheckBox( props: { cw: number } ): React.ReactElement<any, any> {
    return (
      <Checkbox
        classes={{
          root: classes.checkBox,
          checked: classes.checkBoxChecked,
        }}
        checkedIcon={<CheckBoxIcon checked />}
        icon={<CheckBoxIcon />}
        color="primary"
        onChange={( e ) => handleCwChange( e, props.cw )}
        checked={CwDatesChecked( props.cw )}
      />
    )
  }

  function DateCheckBox( { date } ): React.ReactElement<{ date: Date }> {
    return (
      <div>
        <Checkbox
          classes={{
            root: classes.checkBox,
            checked: classes.checkBoxChecked,
          }}
          checkedIcon={<CheckBoxIcon checked />}
          icon={<CheckBoxIcon />}
          color="primary"
          onChange={( e ) => handleDateChange( e, date )}
          checked={dateIncluded( selectedDates, date )}
        />
      </div>
    )
  }

  function CheckBoxIcon( props: { checked?: boolean } ) {
    const checkBoxClasses = [classes.checkBoxIcon]
    if ( props.checked ) {
      checkBoxClasses.push( classes.checkBoxIconChecked )
    }
    return <div className={checkBoxClasses.join( ' ' )} aria-hidden="true" />
  }

  return (
    <>
      <h2>Wann hast du Zeit?</h2>
      <div className={String( classes.wrapper )}>
        <p>
          Zeitraum:
          {dayjs( firstDate ).format(
            firstDate.getMonth() === lastDate.getMonth()
              ? 'D.'
              : 'D. MMMM' +
                  ( firstDate.getFullYear() !== lastDate.getFullYear()) ??
                  ' YYYY'
          )}
          &nbsp;-&nbsp;
          {dayjs( lastDate ).format( 'D. MMMM YYYY' )}
        </p>
        <FormGroup row>
          <FormControlLabel
            classes={{
              root: `${classes.checkBoxLabel} ${classes.headCheckBox}`,
              label: String( classes.checkBoxLabelText ),
            }}
            control={<AllCheckBox />}
            label={'✓'}
          />
          {[...new Array( 7 )].map(( e, index ) => (
            <FormControlLabel
              key={index}
              classes={{
                root: `${classes.checkBoxLabel} ${classes.headCheckBox}`,
                label: String( classes.checkBoxLabelText ),
              }}
              control={<DayCheckBox dayOfWeek={index} />}
              label={dayjs().weekday( index ).format( 'dddd' )}
            />
          ))}
        </FormGroup>
        {Array.from( datesByWeeks.keys()).map(( cw ) => (
          <FormGroup row key={cw}>
            <FormControlLabel
              classes={{
                root: `${classes.checkBoxLabel} ${classes.headCheckBox}`,
                label: String( classes.checkBoxLabelText ),
              }}
              control={<CwCheckBox cw={cw} />}
              label={`CW ${cw}`}
            />
            {datesByWeeks.get( cw ).map(( date: Date, dateIndex: number ) => (
              <FormControlLabel
                key={dateIndex}
                classes={{
                  root: classes.checkBoxLabel,
                  label: classes.checkBoxLabelText,
                }}
                control={<DateCheckBox date={date} />}
                label={date.getDate()}
              />
            ))}
          </FormGroup>
        ))}
      </div>
    </>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  wrapper: {
    padding: '10px',
    background: '#f7f7f7',
  },
  legend: {
    // todo: get rid of fixed dimensions
    width: '50px',
    height: '50px',
    lineHeight: '50px',
  },
  headCheckBox: {},
  checkBox: {
    padding: '2px',
  },
  checkBoxChecked: {
    color: theme.palette.primary.contrastText,
  },
  checkBoxIcon: {
    width: '36px',
    height: '36px',
    border: '1px dotted ' + theme.palette.grey[400],
    borderRadius: '3px',
    background: '#fff',
    '$headCheckBox &': {
      border: '1px solid ' + theme.palette.primary.main,
    },
  },
  checkBoxIconChecked: {
    borderType: 'solid',
    background: '#BDE3DC',
    '$headCheckBox &': {
      background: theme.palette.primary.main,
    },
  },
  checkBoxLabel: {
    position: 'relative',
    margin: 0,
  },
  checkBoxLabelBold: {},
  checkBoxLabelText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'block',
    marginTop: '1px',
    fontFamily: 'Consolas, monaco, monospace',
    fontSize: '14px',
    lineHeight: '1.2',
    // show first two chars
    width: '2.1ch',
    overflow: 'hidden',
    '$headCheckBox &': {
      color: theme.palette.primary.main,
    },
    '$checkBoxChecked + &': {
      color: theme.palette.text.primary,
    },
    '$headCheckBox $checkBoxChecked + &': {
      color: theme.palette.primary.contrastText,
    },
  },
} ))
