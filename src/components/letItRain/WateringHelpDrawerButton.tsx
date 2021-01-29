import {Button, Container, Typography} from '@material-ui/core'
import * as React from 'react'

import {BottomDrawer} from '../basic'
import {AvailableIcon, ItsMyTurnIcon, IWillHelpIcon} from './icons'

interface Props {
  drawerOpen: boolean;
  onClose?: () => void;
}

export function WateringHelpDrawer( {drawerOpen, onClose } : Props ) {

  return (
    <BottomDrawer
      open={drawerOpen}
      toolbar={<Typography variant='h5'>Hilfe zum Gießplan</Typography>}
      onClose={onClose}>
      <Container style={{minHeight: '300px', backgroundColor: 'white'}}>
        <Typography>
             Die Tropfen zeigen dir deine Gießzeiten.
        </Typography>
        <Typography>
          <ItsMyTurnIcon /> Du bist fest zum Gießen eingeplant.
        </Typography>
        <Typography>
          <AvailableIcon/>Du hast dich verfügbar gemeldet, aber der Gießplan ist noch nicht erstellt.
        </Typography>
        <Typography>
          <IWillHelpIcon/> Du kannst einen spontanen Einsatz anmelden.
        </Typography>
        <Typography>
            Die Farben zeigen dir, wie viele Menschen sich zum Gießen gemeldet haben.
        </Typography>

        <Button onClick={() => onClose && onClose()}>Okay, verstanden!</Button>
      </Container>
    </BottomDrawer>
  )
}

