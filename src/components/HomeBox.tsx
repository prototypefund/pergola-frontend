import * as React from 'react'

import { Calendar } from './Calendar'

export function HomeBox() {
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
