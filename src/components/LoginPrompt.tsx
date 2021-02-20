import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import LockIcon from '@material-ui/icons/Lock'
import LockOpenRounded from '@material-ui/icons/LockOpenRounded'
import { useKeycloak } from '@react-keycloak/web'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

export function LoginPrompt() {
  const classes = useStyles()
  const { t } = useTranslation()
  const { keycloak } = useKeycloak()
  const history = useHistory()

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={true}>
      <DialogTitle disableTypography={true}>
        <Typography variant="h4" align="center">{t( 'user.loginPrompt' )}</Typography>
        <IconButton className={classes.closeIconButton} onClick={history.goBack}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center" my={2}>
          <LockIcon fontSize="large" color="primary"  />
        </Box>
        <Box textAlign="center" my={2} mx="auto" maxWidth="175px">
          <Typography>
            {t( 'user.loginPlease' )}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button autoFocus onClick={history.goBack} variant="contained">
          {t( 'back' )}
        </Button>
        <Button onClick={() => keycloak.login()} variant="contained" color="primary" endIcon={<LockOpenRounded />}>
          {t( 'user.login' )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles((theme) => ( {
  closeIconButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  dialogActions: {
    padding: theme.spacing(1),
    justifyContent: 'center'
  }
} ))