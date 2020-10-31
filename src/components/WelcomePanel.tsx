// @ts-nocheck
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'

function WelcomePanel() {
  // TODO: Get gardens from API
  const [gardens] = [
    'Hechtgrün',
    'Strießkanne',
    'Wurzelwerk'
  ]

  return (
    <TextField {...params} label="Hey, where do you want to get started?" variant="outlined" />
  )
}

export default WelcomePanel