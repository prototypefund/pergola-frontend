import {Box, Fab, Link, makeStyles, Theme} from '@material-ui/core'
import { ChatBubble } from '@material-ui/icons'
import * as React from 'react'

export function LetItRainSurveyFab() {
  const classes = useStyles()

  return (
    <Box position='absolute'>
      <Fab color='secondary' className={classes.fab}>
        <Link href='https://stephho.typeform.com/to/eTiWosV0' target='_blank'> <ChatBubble /> </Link>
      </Fab>
    </Box>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  fab: {
    position: 'fixed',
    right: '20px',
    bottom: '70px',
    '& a': {
      color: 'white',
      display: 'flex',
      justifyConent: 'center'
    }
  }

} ))
