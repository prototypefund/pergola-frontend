import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { Calendar } from '../components/calendar'

export default {
  title: 'Pergola/Calendar',
  component: Calendar,
} as Meta

const Template: Story<object> = ( args ) => <Calendar />

export const CalendarDefault = Template.bind( {} )
CalendarDefault.args = {}
