import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, makeStyles,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import * as React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'

import {WateringPeriodManager} from '../components/letItRain'

export function LetItRainManageDialog() {
  const { url } = useRouteMatch()
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery( theme.breakpoints.down( 'sm' ))

  return (
    <Dialog open={true} fullScreen={fullScreen}>
      <DialogTitle disableTypography={true}><Typography variant="h4" align="center">Manage Watering Periods</Typography></DialogTitle>
      <DialogContent><WateringPeriodManager /></DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button autoFocus color="primary" variant="outlined" onClick={() => history.goBack() }>Zum Gießkalender</Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() => ( {
  dialogActions: {
    padding: '1rem 0',
    justifyContent: 'center'
  }
} ))

