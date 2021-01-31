import {Link, makeStyles, Theme, Typography} from '@material-ui/core'
import dayjs from 'dayjs'
import React, {useEffect, useRef} from 'react'

import {CornerBadge} from '../basic'

interface WateringCalendarTaskItemProps {
  date: Date;
  recruiterCount: number;
  onSelect?: Function;
  active?: boolean;
  inPeriod?: boolean;
  cornerActive?: boolean;
  optimalRecruiterCount?: number;
  size?: number;
  onActivate?: (  active: boolean,  ref: HTMLElement | null ) => void;
}

interface WateringCalendarTaskItemStylesProps {
  recruiterMissingCount: number;
  active?: boolean;
  inPeriod?: boolean;
  size: number;
}

export const WateringCalendarTaskItem = (
  {
    date,
    recruiterCount,
    optimalRecruiterCount = 3,
    size = 60,
    onSelect,
    onActivate,
    active = false,
    inPeriod,
    cornerActive
  }: WateringCalendarTaskItemProps ) => {
  const d = dayjs( date )
  const classes = useStyles( {
    recruiterMissingCount: optimalRecruiterCount - recruiterCount,
    active, size, inPeriod} )

  const ref = useRef<HTMLSpanElement | null>( null )

  useEffect(() => {
    onActivate && active && onActivate( active, ref?.current )
  }, [active, ref] )



  return (
    <Link ref={ref as any} underline='none' onClick={() => onSelect && onSelect()} component="button">
      <div className={classes.dayContainer}>
        <CornerBadge className={classes.badge} cornerActive={cornerActive}>
          <div className='badgeContent'>
            <Typography variant="h6">{d.format( 'dd' )}</Typography>
            <Typography variant="body1">{d.format( 'DD.M.' )}</Typography>
          </div>
        </CornerBadge>
      </div>
    </Link>
  )
}

const useStyles = makeStyles<Theme, WateringCalendarTaskItemStylesProps>(( theme ) => ( {
  badge: {
    backgroundColor: ( {recruiterMissingCount, inPeriod} ) => (
      !inPeriod
        ? theme.palette.grey['400']
        : ( recruiterMissingCount >= 2
          ? '#FFBD4A'
          : ( recruiterMissingCount === 2
            ? '#F6E6A2'
            : '#BDE3DC' ))
    )},
  dayContainer:  {
    padding: '2px',
    height: ( {size} ) => `${size +  20}px`,
    '& .badgeContent': {
      transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, height 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      width: ( {size, active} ) => `${size + ( active ? 20 : 0 )}px`,
      height: ( {size, active} ) => `${size + ( active ? 20 : 0 )}px`,
    },
    color: theme.palette.grey['800'],
    fontWeight: ( {active} ) => active ? 'bold' : 'normal',
    '& h6': {
      fontWeight: ( {active} ) => active ? 'bold' : 'normal',
    }
  }
} ))
