import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import * as React from 'react'
import { useSelector } from 'react-redux'

import { HomeBox } from '../components'

export function HomePage() {
  const classes = useStyles()
  const [boxColor, setBoxColor] = React.useState( 'red' )

  const onButtonClick = () => setBoxColor( boxColor === 'red' ? 'blue' : 'red' )

  return (
    <div className={classes.root}>
      <div className={classes.centerContainer}>
        <HomeBox size={300} color={boxColor} />
        <Button
          className={classes.button}
          onClick={onButtonClick}
          variant="outlined"
          color="primary"
        >
          Change Color
        </Button>
      </div>
    </div>
  )
}

const useStyles = makeStyles( {
  root: {
    height: '100%',
    textAlign: 'center',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },

  centerContainer: {
    flex: 1,
    height: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  button: {
    marginTop: 20,
  },
} )
