import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { GardenOverviewPage } from '../pages'

export default {
  title: 'Pergola/GardenOverviewPage',
  component: GardenOverviewPage,
} as Meta

const Template: Story<object> = ( args ) => <GardenOverviewPage />

export const GardenOverviewPageDefault = Template.bind( {} )
GardenOverviewPageDefault.args = {}
