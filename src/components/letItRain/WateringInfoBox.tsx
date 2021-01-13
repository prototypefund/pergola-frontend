import {Box, Button, makeStyles, Paper, Typography} from '@material-ui/core'
import {FormatColorReset as NoDropIcon, Opacity as DropIcon} from '@material-ui/icons'
import dayjs, {Dayjs} from 'dayjs'
import {CSSProperties} from 'react'
import * as React from 'react'

export const WateringTinyInfoBox: ( {date, helpNeeded}: { date: Date | Dayjs, helpNeeded?: Boolean, style?: CSSProperties, dropCount?: number } ) => JSX.Element = ( {date, helpNeeded, style, dropCount} ) => {

  const classes = useStyles()

  return (
    <Paper elevation={0} className={[classes.dayInfoSecondary, classes.dayInfoBox].join( ' ' )}
      style={style}>
      <div className={classes.dateMMMYY}>
        {dayjs( date ).format( 'll' )}
      </div>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        {helpNeeded && <div>
          <Button color='primary'>komm helfen!</Button>
        </div>}
        <Box flexGrow={1} textAlign='right'>
          { !dropCount || dropCount <= 0
            ? <NoDropIcon />
            : ( new Array( dropCount ).fill( undefined )).map(( _, i ) => (
              <DropIcon key={i}/>
            ))}
        </Box>
      </Box>
    </Paper> )
}

export const WateringateInfoBox: ( {date, helpNeeded}: { date: Date | Dayjs, helpNeeded?: Boolean, style?: CSSProperties, dropCount?: number } ) => JSX.Element = ( {date, helpNeeded, style, dropCount} ) => {

  const classes = useStyles()

  return (
    <Paper elevation={0} className={[classes.dayInfoPrimary, classes.dayInfoBox].join( ' ' )} style={style}>
      <Typography className={classes.todayContainerToday} variant="h2">heute</Typography>
      <div className={classes.dateField}>
        <span className={classes.dateDD}>{dayjs( date ).format( 'DD' )}</span>
        <div>
          <div className={classes.dateMMMYY}>{dayjs( date ).format( 'MMM YYYY' )}</div>
          <div className={classes.dateDay}>{dayjs( date ).format( 'dddd' )}</div>
        </div>
        <Box flexGrow={1} textAlign='right'>
          { !dropCount || dropCount <= 0
            ? <NoDropIcon />
            : ( new Array( dropCount ).fill( undefined )).map(( _, i ) => (
              <DropIcon key={i}/>
            ))}
        </Box>
        <div/>
      </div>
    </Paper>
  )}

const useStyles = makeStyles(( theme ) => ( {
  todayContainerToday: {
    fontSize: '16pt',
    textTransform: 'uppercase'
  },
  dateField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dayInfoPrimary: {
    backgroundColor: '#BDE3DC'

  },
  dayInfoBox: {
    margin: '8px',
    padding: '16px',
    flexGrow: 1
  },
  dayInfoSecondary: {},
  wizardPaper: {
    padding: '19px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'arial'
  },
  dateDD: {
    fontSize: '48pt',
    fontWeight: 'bold',
    marginRight: '8px'
  },
  dateDay: {
    fontSize: '16pt'
  },
  dateMMMYY: {
    fontSize: '16pt',
    fontWeight: 'bold'
  }

} ))


