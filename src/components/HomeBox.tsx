import { makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import * as React from 'react'

import { Calendar } from './Calendar'

interface Props {
  size: number;
  color: 'red' | 'blue' | string;
}

export function HomeBox( props: Props ) {
  const { size, ...other } = props
  const classes = useStyles( props )

  return (
    <div>
      <Calendar
        dates={[
          new Date( 2021, 4, 31 ),
          new Date( 2021, 5, 1 ),
          new Date( 2021, 5, 2 ),
          new Date( 2021, 5, 3 ),
          new Date( 2021, 5, 4 ),
          new Date( 2021, 5, 5 ),
          new Date( 2021, 5, 6 ),
          new Date( 2021, 5, 7 ),
          new Date( 2021, 5, 8 ),
          new Date( 2021, 5, 9 ),
          new Date( 2021, 5, 10 ),
          new Date( 2021, 5, 11 ),
          new Date( 2021, 5, 12 ),
          new Date( 2021, 5, 13 ),
        ]}
      />
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
