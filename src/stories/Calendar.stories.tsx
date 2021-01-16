import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { Calendar } from '../components/Calendar'

export default {
  title: 'Pergola/Calendar',
  component: Calendar,
} as Meta

const Template: Story<object> = () => <Calendar
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

export const CalendarDefault = Template.bind( {} )
CalendarDefault.args = {}
