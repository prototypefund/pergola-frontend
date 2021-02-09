import {Button, Snackbar } from '@material-ui/core'
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
  return (
    <>
      <Snackbar
        open={!!update}
        message="New content is available; please refresh."
        action={
          <Button
            variant='outlined'
            component='button'
            onClick={update}
            disabled={refreshing}
          >
            refresh
          </Button>
        }
      />
    </>
  )
}

export default ServiceWorkerUpdateManager
