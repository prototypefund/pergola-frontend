import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import { useState } from 'react'

type DateRangeStruct = {
  startDate: dayjs.Dayjs;
  dayBegin: string;
  month: string;
  year: string;
  dayEnd: string;
};

const makeDateRange: ( startDate: dayjs.Dayjs ) => DateRangeStruct = (
  startDate
) => ( {
  startDate,
  dayBegin: startDate.format( 'DD' ),
  dayEnd: startDate.add( 6, 'day' ).format( 'DD' ),
  month: startDate.format( 'MMM' ),
  year: startDate.format( 'YYYY' ),
} )

export function WeekSelector() {
  const classes = useStyles()

  const initialRange = makeDateRange( dayjs().startOf( 'week' ))
  const [dateRange, setDateRange] = useState<DateRangeStruct>( initialRange )

  const handleJumpWeek = ( weekCount ) =>
    setDateRange( makeDateRange( dateRange.startDate.add( weekCount, 'week' )))

  const getDateRangeString: ( dateRange: DateRangeStruct ) => string = ( {
    dayBegin,
    dayEnd,
    month,
    year,
  } ) => `${dayBegin}. - ${dayEnd}. ${month} ${year}`

  return (
    <div className={classes.container}>
      <IconButton onClick={() => handleJumpWeek( -1 )}>
        <ChevronLeft />
      </IconButton>
      <Typography>{getDateRangeString( dateRange )}</Typography>
      <IconButton onClick={() => handleJumpWeek( 1 )}>
        <ChevronRight />
      </IconButton>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
} ))
