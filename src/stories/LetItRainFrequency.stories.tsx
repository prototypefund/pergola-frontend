import {Meta, Story} from '@storybook/react/types-6-0'
import React from 'react'

import { LetItRainFrequency } from '../pages/LetItRainFrequency'

export default {
  title: 'Pergola/LetItRainFrequency',
  component: LetItRainFrequency,
} as Meta

const Template: Story<object> = ( args ) => <LetItRainFrequency/>

export const LetItRainFrequencyDefault = Template.bind( {} )
LetItRainFrequencyDefault.args = {}
