import {Meta, Story} from '@storybook/react/types-6-0'
import React from 'react'

import {LetItRainEntry} from '../pages/LetItRainEntry'

export default {
  title: 'Pergola/LetItRainEntry',
  component: LetItRainEntry,
} as Meta

const Template: Story<object> = ( args ) => <LetItRainEntry/>

export const LetItRainEntryDefault = Template.bind( {} )
LetItRainEntryDefault.args = {}
