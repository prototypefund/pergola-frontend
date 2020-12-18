import { makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import React, { useState } from 'react'

import { GardenMap } from '../components'
import BackgroundImage from '../static/background_full_grey_02.jpg'

export function GardenOverviewPage() {
  const classes = useStyles()

  return (
    <div className={classes.page}>
      <Typography className="page-title" variant="h2">
        Wurzelwerk von oben
      </Typography>
      <hr className="style0" />
      <Paper elevation={0}>
        <GardenMap />
      </Paper>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  page: {
    backgroundImage: `url(${BackgroundImage})`,
  },
} ))
