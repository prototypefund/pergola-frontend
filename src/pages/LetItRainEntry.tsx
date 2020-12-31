import {Box, Button, Container, makeStyles, Paper, Typography} from '@material-ui/core'
import {FormatColorReset as NoDropIcon, Opacity as DropIcon} from '@material-ui/icons'
import dayjs, {Dayjs} from 'dayjs'
import * as React from 'react'
import {CSSProperties} from 'react'
import {Link, Route, Switch} from 'react-router-dom'

import {LetItRainWizard} from './LetItRainWizard'


export function LetItRainEntry() {
  const classes = useStyles()
  dayjs.locale( 'de' )

  const TinyDateBox: ( {date, helpNeeded}: { date: Date | Dayjs, helpNeeded?: Boolean, style?: CSSProperties, dropCount?: number } ) => JSX.Element = ( {date, helpNeeded, style, dropCount} ) => (
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
    </Paper>
  )

  const DateBox: ( {date, helpNeeded}: { date: Date | Dayjs, helpNeeded?: Boolean, style?: CSSProperties, dropCount?: number } ) => JSX.Element = ( {date, helpNeeded, style, dropCount} ) => (
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
  )

  const today = dayjs()

  return (
    <Container className={classes.main} component="main">
      <Paper elevation={3} className={classes.wizardPaper}>
        <Box textAlign='center'>
          <Typography variant='h2' className={classes.title}>Let it rain!</Typography>
          <hr className={classes.titleDivider} />
        </Box>
        <DateBox date={today} dropCount={3}/>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <TinyDateBox date={today.add( 1, 'day' )} style={{backgroundColor: '#F6E6A2'}}/>
          <TinyDateBox date={today.add( 2, 'day' )} helpNeeded={true} style={{backgroundColor: '#FFBD4A'}}/>
        </Box>
        <Switch>
          <Route path='/watering/wizard/:stepNumber' component={LetItRainWizard} />
        </Switch>
        <Box display='flex' flexDirection='column' justifyContent='flex-end' alignItems='center'>
          <Link to='/watering/wizard/0' >
            <Button variant='contained' color='primary'>Giessdienst eintragen</Button>
          </Link>
          <Button>Kalender anschauen</Button>
        </Box>
      </Paper>
    </Container>
  )
}


const useStyles = makeStyles(( theme ) => ( {
  main: {
    minHeight:  '500px'

  },
  title: {
    fontFamily: 'Pacifico'
  },
  titleDivider: {
    height: 0,
    borderStyle: 'solid',
    borderColor: '#13AB8C',
    borderWidth: '2pt',
    backgroundColor: '#13AB8C',
    borderRadius: '2pt',
    fontWeight: 'normal',
    width: '25px'
  },
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



