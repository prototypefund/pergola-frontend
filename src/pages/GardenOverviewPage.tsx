import {makeStyles, Paper, Typography} from '@material-ui/core'
import React from 'react'

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
      <Paper elevation={0} style={{height: 'calc(100% - 56px)'}}>
        <GardenMap />
      </Paper>
    </div>
  )
}

const useStyles = makeStyles(() => ( {
  page: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'fixed',
    height: '100%'
  },
} ))
