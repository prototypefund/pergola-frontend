import { Container } from '@material-ui/core'
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { PaperDrop, WeekSelector } from '../components'

export default {
  title: 'Pergola/PaperDrop',
  component: PaperDrop,
} as Meta

const Template: Story<object> = () => <Container style={{ backgroundColor: 'black' }}>
  <PaperDrop>
    <WeekSelector />
  </PaperDrop>
</Container>

export const PaperDropDefault = Template.bind( {} )
PaperDropDefault.args = {}
