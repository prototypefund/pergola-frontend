import {Box, Link, makeStyles, Theme, Typography} from '@material-ui/core'
import dayjs from 'dayjs'
import React, {useEffect, useRef} from 'react'

import {CornerBadge} from '../basic'

interface WateringCalendarTaskItemProps {
  disabled?: boolean;
  date: Date;
  recruiterCount: number;
  onSelect?: Function;
  active?: boolean;
  inPlannedPeriod?: boolean;
  cornerActive?: boolean;
  optimalRecruiterCount?: number;
  size?: number;
  onActivate?: (  active: boolean,  ref: HTMLElement | null ) => void;
  scrollBehavior?: 'smooth' | 'auto';
}

interface WateringCalendarTaskItemStylesProps {
  recruiterMissingCount: number;
  active?: boolean;
  inPlannedPeriod?: boolean;
  size: number;
  disabled?: boolean;
}

export const WateringCalendarTaskItem = (
  {
    disabled,
    date,
    recruiterCount,
    optimalRecruiterCount = 3,
    size = 60,
    onSelect,
    onActivate,
    active = false,
    inPlannedPeriod,
    cornerActive,
    scrollBehavior
  }: WateringCalendarTaskItemProps ) => {
  const d = dayjs( date )
  const classes = useStyles( {
    recruiterMissingCount: optimalRecruiterCount - recruiterCount,
    active, size, inPlannedPeriod, disabled} )

  const ref = useRef<HTMLSpanElement | null>( null )

  useEffect(() => {
    if( active ) {
      ref?.current?.scrollIntoView( {
        behavior: scrollBehavior,
        block: 'center',
        inline: 'center'
      } )
      onActivate && onActivate( active, ref?.current )
    }
  }, [active, ref] )



  return (
    <Link ref={ref as any} underline='none' onClick={() => onSelect && onSelect()} component="button">
      <div className={classes.dayContainer}>
        <CornerBadge className={classes.badge} cornerActive={cornerActive}>
          <Box display="flex" flexDirection="column" justifyContent="center" className='badgeContent'>
            <Typography className={classes.dayTitle}>{d.format( 'dd' )}</Typography>
            <Typography className={classes.daySubTitle}>{d.format( 'DD.M.' )}</Typography>
          </Box>
        </CornerBadge>
      </div>
    </Link>
  )
}

const useStyles = makeStyles<Theme, WateringCalendarTaskItemStylesProps>(( theme ) => ( {
  badge: {
    backgroundColor: ( {recruiterMissingCount, inPlannedPeriod} ) => (
      !inPlannedPeriod
        ? theme.palette.grey['400']
        : ( recruiterMissingCount >= 2
          ? '#FFBD4A'
          : ( recruiterMissingCount === 2
            ? '#F6E6A2'
            : '#BDE3DC' ))
    )},
  dayContainer:  {
    opacity: ( {disabled} ) => disabled ? 0.5 : 1.0,
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
  },
  dayTitle: ( {active} ) => ( {
    fontSize:   active ?  '1.5rem' : '1rem',
    fontWeight:  active ? 'bold' : 'normal',
    textTransform: 'uppercase'
  } ),
  daySubTitle: ( {active} ) => ( {
    fontSize: active ?  '1.2rem' : '.9rem',
    fontWeight: active ? 'bold' : 'normal',
  } )
} ))
