import {Box, Button, LinearProgress, Snackbar, Typography } from '@material-ui/core'
import React, {MouseEventHandler,useCallback, useEffect, useRef, useState  } from 'react'
import { register } from 'register-service-worker'


const useAlive = () => {
  const isAliveRef = useRef( true )
  useEffect(
    () => () => {
      isAliveRef.current = false
    },
    []
  )
  return useCallback(() => isAliveRef.current, [] )
}

function ServiceWorkerUpdateManager() {
  if( process.env.TARGET !== 'web' ) return null
  const checkAlive = useAlive()
  const [dismissed, setDismissed] = useState( false )

  const [update, setUpdate] = useState<MouseEventHandler<HTMLElement> | undefined>()
  const [refreshing, setRefreshing] = useState( false )
  useEffect(() => {
    register( '/service-worker.js', {
      registrationOptions: { scope: './' },
      updated( registration ) {
        setUpdate(() => ( _ ) => {
          if ( !checkAlive()) return
          setRefreshing( true )
          registration.waiting?.postMessage( { type: 'SKIP_WAITING' } )
          registration.update().then(() => window.location.reload())
        } )
      },
    } )
  }, [] )

  const [progress, setProgress] = useState( 100 )
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(( prevProgress ) => {
        if( prevProgress < 0 ) {
          setDismissed( true )
          clearInterval( timer )
          return 100
        }
        return prevProgress - 10 } )
    }, 500 )
    return () => {
      clearInterval( timer )
    }
  }, [] )
  return (
    <Snackbar
      open={!!update && !dismissed}
      onClose={() => setDismissed( true )}
      message={
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography>New version is available - please refresh.</Typography>
          </Box>
        </Box>
      }
      action={
        <>
          <Button
            variant='outlined'
            component='button'
            onClick={() => setDismissed( true )}
          >
              later
          </Button>
          <Button
            variant='outlined'
            component='button'
            onClick={update}
            disabled={refreshing}
          >
              refresh
          </Button>
        </>
      }
    />
  )
}

export default ServiceWorkerUpdateManager
