import { makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import * as React from 'react'

import { Calendar } from './calendar'
import { MyCalendar } from './MyCalendar'

interface Props {
  size: number;
  color: 'red' | 'blue' | string;
}

export function HomeBox( props: Props ) {
  const { size, ...other } = props
  const classes = useStyles( props )

  return (
    <div>
      <Calendar />
      {/* <MyCalendar dates={[
        new Date( 2021, 4, 1 ),
        new Date( 2021, 4, 2 ),
        new Date( 2021, 4, 3 ),
        new Date( 2021, 4, 4 ),
        new Date( 2021, 4, 5 ),
        new Date( 2021, 4, 6 ),
        new Date( 2021, 4, 7 ),
        new Date( 2021, 4, 8 ),
        new Date( 2021, 4, 9 ),
        new Date( 2021, 4, 10 ),
        new Date( 2021, 4, 11 )
      ]} /> */}
    </div>
  )
}

const styledBy = ( property: string, props: any, mapping: any ): string =>
  mapping[props[property]]
const useStyles = makeStyles(( theme: Theme ) => ( {
  box: ( props: Props ) => ( {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    background: styledBy( 'color', props, {
      red: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      blue: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    } ),
    height: props.size,
    width: props.size,
  } ),

  text: {
    color: 'white',
  },
} ))
