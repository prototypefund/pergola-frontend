import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'
import * as React from 'react'
import {Link} from 'react-router-dom'

export function LetItRainThanksDialog() {
  return (
    <Dialog open={true}>
      <DialogTitle>Thanks!</DialogTitle>
      <DialogContent>Thank you for your efford</DialogContent>
      <DialogActions>
        <Link to='/watering'><Button variant="contained" color='primary'>okay</Button></Link>
      </DialogActions>
    </Dialog>
  )
}

