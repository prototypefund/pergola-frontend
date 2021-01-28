import {IconButton, makeStyles, Typography} from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useState} from 'react'

type DateRangeStruct = {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};

const DAYS_PER_WEEK = 7 //probably will only change if flat earthers take over

const makeDateRange: ( startDate: dayjs.Dayjs ) => DateRangeStruct = (
  startDate
) => ( {
  startDate,
  endDate: startDate.add( DAYS_PER_WEEK - 1, 'day' ),
} )

interface Props {
  date?: Date,
  children?: (( props: {startDate: Date, dayCount: number, nextPage: () => void, prevPage: () => void} ) => React.ReactNode ) | React.ReactNode;
}

export function WeekSelector( {date, children}: Props ) {
  const classes = useStyles()

  const initialRange = makeDateRange( dayjs( date ).startOf( 'week' ))
  const [dateRange, setDateRange] = useState<DateRangeStruct>( initialRange )

  const handleJumpWeek = ( weekCount ) =>
    setDateRange( makeDateRange( dateRange.startDate.add( weekCount, 'week' )))

  const getDateRangeString: ( dateRange: DateRangeStruct ) => string = ( {
    startDate,
    endDate
  } ) => `${startDate.format( 'DD.MMM.' )} - ${endDate.format( 'DD.MMM.' )} ${endDate.format( 'YYYY' )}`

  const nextPage = ()  => handleJumpWeek( 1 )
  const prevPage = ()  => handleJumpWeek( -1 )

  return (
    <>
      <div className={classes.container}>
        <IconButton onClick={prevPage}>
          <ChevronLeft />
        </IconButton>
        <Typography>{getDateRangeString( dateRange )}</Typography>
        <IconButton onClick={nextPage}>
          <ChevronRight />
        </IconButton>
      </div>
      {children && ( typeof children === 'function' ? children( {startDate: dateRange.startDate.toDate(), dayCount: DAYS_PER_WEEK, nextPage, prevPage } ) : children )}
    </>
  )
}

const useStyles = makeStyles(() => ( {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
} ))
