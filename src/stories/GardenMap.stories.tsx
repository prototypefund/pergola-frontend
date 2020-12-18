import 'leaflet/dist/leaflet.css'

import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { GardenMap } from '../components'

export default {
  title: 'Pergola/GardenMap',
  component: GardenMap,
} as Meta

const Template: Story<object> = ( args ) => <GardenMap />

export const GardenMapDefault = Template.bind( {} )
GardenMapDefault.args = {}
