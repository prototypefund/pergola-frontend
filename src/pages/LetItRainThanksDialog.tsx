import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import {AvTimerRounded, NotificationsActiveRounded, SettingsRounded} from '@material-ui/icons'
import * as React from 'react'
import { Link } from 'react-router-dom'

import Sunflower from '../static/sunflower.svg'

export function LetItRainThanksDialog() {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery( theme.breakpoints.down( 'sm' ))

  return (
    <Dialog open={true} fullScreen={fullScreen}>
      <DialogTitle disableTypography={true}><Typography variant="h4" align="center">Danke für's Mitmachen!</Typography></DialogTitle>
      <DialogContent>
        <Box textAlign="center" mb={2}>
          <img src={Sunflower} alt="" />
        </Box>
        <Typography variant="h5" align="center">Was passiert jetzt?</Typography>
        <List component="ol">
          <ListItem>
            <ListItemIcon>
              <AvTimerRounded color="primary" />
            </ListItemIcon>
            <ListItemText primary="Andere Gärtner*innen melden, wann sie gießen wollen, bis es schließlich Zeit wird." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SettingsRounded color="primary" />
            </ListItemIcon>
            <ListItemText primary="Mit Hilfe eines ausgeklügelten Algorithmus wird ein super fairer Gießplan erstellt." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <NotificationsActiveRounded color="primary" />
            </ListItemIcon>
            <ListItemText primary="Du wirst benachrichtigt, wenn deine Hilfe tatsächlich benötigt wird." />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Link to='/watering'>
          <Button autoFocus color="primary" variant="outlined">Zum Gießkalender</Button>
        </Link>
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

