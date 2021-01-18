import {Button, Container, Typography} from '@material-ui/core'
import { Help as HelpIcon} from '@material-ui/icons'
import * as React from 'react'
import {useState} from 'react'

import {BottomDrawer} from '../basic'

export function WateringHelpDrawerButton() {
  const [drawerOpen, setDrawerOpen] = useState( false )

  return (
    <>
      <Button onClick={() => setDrawerOpen( true )}>Hilfe <HelpIcon/></Button>
      <BottomDrawer
        open={drawerOpen}
        toolbar={<Typography variant='h5'>Hilfe zum Gießplan</Typography>}
        onClose={() => setDrawerOpen( false )}>
        <Container style={{minHeight: '300px', backgroundColor: 'white'}}>
          <Typography>kasdlkdsnf;kanjv;fsnjvfav</Typography>
          <Button onClick={() => setDrawerOpen( false )}>Okay, verstanden!</Button>
        </Container>
      </BottomDrawer>
    </>
  )
}

