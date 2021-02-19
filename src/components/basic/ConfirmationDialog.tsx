import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'
import { useTranslation } from 'react-i18next'


export interface ConfirmationDialogProps {
  keepMounted: boolean;
  open: boolean;
  onClose: ( value?: boolean ) => void;
  children: React.ReactChild;
  title?: string;
  okContent?: string;
  cancelContent?: string;

}

export function ConfirmationDialog( props: ConfirmationDialogProps ) {
  const {t} = useTranslation()
  const { onClose, okContent, cancelContent, title, open, children, ...other } = props
  const handleCancel = () => {
    onClose( false )
  }

  const handleOk = () => {
    onClose( true )
  }


  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers >{children}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          {cancelContent  || t( 'cancel' )}
        </Button>
        <Button onClick={handleOk} color="primary">
          {okContent || t( 'okay' )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

