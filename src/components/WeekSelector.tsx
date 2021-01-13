import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {ReactNode, useState} from 'react'
import {RouteChildrenProps} from 'react-router'

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
  children?: (( props: {startDate: Date, dayCount: number} ) => React.ReactNode ) | React.ReactNode;
}

export function WeekSelector( {children}: Props ) {
  const classes = useStyles()

  const initialRange = makeDateRange( dayjs().startOf( 'week' ))
  const [dateRange, setDateRange] = useState<DateRangeStruct>( initialRange )

  const handleJumpWeek = ( weekCount ) =>
    setDateRange( makeDateRange( dateRange.startDate.add( weekCount, 'week' )))

  const getDateRangeString: ( dateRange: DateRangeStruct ) => string = ( {
    startDate,
    endDate
  } ) => `${startDate.format( 'DD.MMM.' )}. - ${endDate.format( 'DD.MMM.' )} ${endDate.format( 'YYYY' )}`

  return (
    <>
      <div className={classes.container}>
        <IconButton onClick={() => handleJumpWeek( -1 )}>
          <ChevronLeft />
        </IconButton>
        <Typography>{getDateRangeString( dateRange )}</Typography>
        <IconButton onClick={() => handleJumpWeek( 1 )}>
          <ChevronRight />
        </IconButton>
      </div>
      {children && ( typeof children === 'function' ? children( {startDate: dateRange.startDate.toDate(), dayCount: DAYS_PER_WEEK } ) : children )}
    </>
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
