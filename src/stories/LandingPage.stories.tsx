import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { LandingPage } from '../pages'

export default {
  title: 'Pergola/LandingPage',
  component: LandingPage,
} as Meta

const Template: Story<object> = () => <LandingPage />

export const LandingPageDefault = Template.bind( {} )
LandingPageDefault.args = {}
