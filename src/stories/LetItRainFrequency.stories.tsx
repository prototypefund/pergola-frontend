import {Meta, Story} from '@storybook/react/types-6-0'
import React from 'react'

import { LetItRainFrequency } from '../components/LetItRainFrequency'

export default {
  title: 'Pergola/LetItRainFrequency',
  component: LetItRainFrequency,
} as Meta

const Template: Story<object> = () => <LetItRainFrequency/>

export const LetItRainFrequencyDefault = Template.bind( {} )
LetItRainFrequencyDefault.args = {}
