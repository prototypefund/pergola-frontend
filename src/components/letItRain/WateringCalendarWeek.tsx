import {
  Box,
  Button,
  Container,
  Drawer,
  Link,
  makeStyles,
  Theme,
  Typography} from '@material-ui/core'
import {
  AddCircle
} from '@material-ui/icons'
import dayjs from 'dayjs'
import React, { useState } from 'react'

interface WateringDayProps {
  date: Date;
  recruiterCount: number;
  onSelect?: Function;
  active?: Boolean;
}

const WateringDay = ( { date, recruiterCount, onSelect, active }: WateringDayProps ) => {
  const d = dayjs( date )
  const classes = useStyles()

  const optimalRecruiters = 3
  const recruiterMissingCount = optimalRecruiters - recruiterCount
  const droughtWarningClass = (() => {
    if ( recruiterMissingCount >= 2 ) {
      return 'droughtrisk2'
    }
    if ( recruiterMissingCount === 1 ) {
      return 'droughtrisk1'
    }
    return ''
  } )()

  return (
    <Link onClick={() => onSelect && onSelect()} component="button">
      <Container className={`${classes.dayContainer} ${active && 'active'}`}>
        <div>

          <Typography component="h4">{d.format( 'dd' )}</Typography>
        </div>
        <div className={`dayInMonth ${droughtWarningClass}`} >

          <Typography component="h4">{d.format( 'D' )}</Typography>
        </div>
        <div>{recruiterMissingCount > 0 && <AddCircle />}</div>
      </Container>
    </Link>
  )
}

interface WateringCalendarWeekProps {
  startDate: Date;
  dayCount: number;
}

const WateringCalendarWeek = ( { startDate, dayCount} : WateringCalendarWeekProps ) => {
  const classes = useStyles()
  const [selectedDay, selectDay] = useState<number>( -1 )
  const [drawerWateringDay, setDrawerWateringDay] = useState<boolean>( false )

  const d = dayjs( startDate )
  const calendarDates = new Array( dayCount )
    .fill( undefined )
    .map(( _, i ) => d.add( i, 'day' ))
    .map(( date ) => ( {
      date,
      recruiterCount: Math.floor( Math.random() * 4 )
    } ))

  const select = ( i ) => {
    selectDay( i )
    if ( i >= 0 ) {
      setDrawerWateringDay( true )
    } else {
      setDrawerWateringDay( false )
    }
  }

  return (
    <>
      <Box display="flex" flexDirection="row" className={classes.weekContainer}>
        {calendarDates.map(( { date, recruiterCount }, i ) => (
          <WateringDay
            onSelect={() => select( i )}
            active={selectedDay === i}
            key={date.toISOString()}
            date={date.toDate()}
            recruiterCount={recruiterCount}
          />
        ))}
      </Box>
      <Drawer
        variant="persistent"
        anchor="bottom"
        open={drawerWateringDay}
        onClose={() => setDrawerWateringDay( false )}
      >
        <Container>
          <AddCircle />
          <Typography>Helfen!</Typography>
          <Button onClick={() => select( -1 )}>zurück</Button>
        </Container>
      </Drawer>
    </>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  dayContainer: {
    '&.active': {
      backgroundColor: 'rgba(180, 180, 180, 0.26)',
      fontWeight: 'bold',
      '& h4': {
        fontWeight: 'bold'
      }
    },
    display: 'flex',
    flexDirection: 'column',
    width: '48px',
    borderRadius: '4px',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 0,
    '&> *': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      height: '44px',
      width: '44px',
      borderRadius: '4px',
      '&.dayInMonth': {
        backgroundColor: '#BDE3DC',
        '&.droughtrisk1': {
          backgroundColor: '#F6E6A2'
        },
        '&.droughtrisk2': {
          backgroundColor: '#FFBD4A'
        }
      }
    }
  },
  weekContainer: {}
} ))

export default WateringCalendarWeek
