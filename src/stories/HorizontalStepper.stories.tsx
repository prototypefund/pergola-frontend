import {Meta, Story} from '@storybook/react/types-6-0'
import React from 'react'

import {HorizontalStepper, StepperProps} from '../components/HorizontalStepper'

export default {
  title: 'Pergola/HorizontalStepper',
  component: HorizontalStepper,
  argTypes: {
    steps: {
      defaultValue: ['Termine', 'Frequenz', 'Erinnerung'],
      control: 'array'
    },
    activeStep: {
      defaultValue: 0,
      control: {
        type: 'range',
        min: 0,
        max: 10,
        step: 1
      }
    }
  }
} as Meta

const Template: Story<StepperProps> = ( args ) => <HorizontalStepper {...args}/>

export const HorizontalStepperDefault = Template.bind( {} )
HorizontalStepperDefault.args = {}

export const HorizontalStepperActive = Template.bind( {} )
HorizontalStepperActive.args = {
  activeStep: 1
}
