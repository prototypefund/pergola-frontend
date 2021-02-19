import {gql, useMutation} from '@apollo/client'
import {Box, Button, LinearProgress, Snackbar, Typography} from '@material-ui/core'
import {useKeycloak} from '@react-keycloak/web'
import {PushKit} from 'pushkit/client/dist/index'
import React, {MouseEventHandler, useCallback, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {register} from 'register-service-worker'
import {PushSubscriptionInput} from 'types/graphql'

interface PushKitClientInstance {
  supported: boolean;
  subscribed: boolean;
  key: string;
  reg?: ServiceWorkerRegistration;
  sub?: PushSubscription;

  handleRegistration(
    reg: ServiceWorkerRegistration
  ): Promise<PushSubscription | null>;
}

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
const pkInstance = (() => {
  try {
    return new PushKit( process.env.REACT_APP_PUBLIC_VAPID_KEY || 'BIwTug5gws8tUV9ojDJoeMOMugRoWBDLRo6f8SbO94nSJ6bblCnMAlEq08XMRWhAUUpDI9W6BmLnY7kEtbD20Rc', true ) as PushKitClientInstance
  } catch ( e ) {
    return
  }
} )()

const PUSH_SUBSCRIBE_MUTATION = gql`
    mutation  pushSubscribe($subscription: PushSubscriptionInput) {
        pushSubscribe(subscription: $subscription)
    }
`

function ServiceWorkerUpdateManager() {
  if( process.env.TARGET !== 'web' ) return null
  const {keycloak: { authenticated = false }} = useKeycloak()
  const checkAlive = useAlive()
  const {t} = useTranslation()
  const [dismissed, setDismissed] = useState( false )
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null >( null )


  const [update, setUpdate] = useState<MouseEventHandler<HTMLElement> | undefined>()
  const [refreshing, setRefreshing] = useState( false )
  const [pushSubscribe] = useMutation<Boolean, { subscription: PushSubscriptionInput }>( PUSH_SUBSCRIBE_MUTATION )

  const registerOrUpdateSubscription = async ( registration: ServiceWorkerRegistration ) => {
    const pushRegistration = await pkInstance?.handleRegistration( registration )
    if ( pushRegistration ) {
      const subscription = pushRegistration.toJSON() as unknown as PushSubscriptionInput
      await pushSubscribe( {variables: {subscription}} )
    }
  }

  useEffect(() => {
    if( !authenticated || !swRegistration ) return
    registerOrUpdateSubscription( swRegistration )
  }, [swRegistration, authenticated] )

  useEffect(() => {
    register( '/service-worker.js', {
      registrationOptions: {scope: './'},
      registered( registration ) {
        console.log( 'Service worker has been registered.' )
        setSwRegistration( registration )
      },
      updated( registration ) {
        console.log( 'New content is available; please refresh.' )
        setSwRegistration( registration )
        setUpdate(() => () => {
          if ( !checkAlive()) return
          setRefreshing( true )
          registration.waiting?.postMessage( {type: 'SKIP_WAITING'} )
          registration.update().then(() => window.location.reload())
        } )
      },
      ready( registration ) {
        console.log( 'Service worker is active.' )
        setSwRegistration( registration )
      },
      cached( registration ) {
        console.log( 'Content has been cached for offline use.' )
        setSwRegistration( registration )
      },
      updatefound( registration ) {
        console.log( 'New content is downloading.' )
        setSwRegistration( registration )
      },
      offline() {
        console.log( 'No internet connection found. App is running in offline mode.' )
      },
      error( error ) {
        console.error( 'Error during service worker registration:', error )
      }
    } )
  }, [] )

  const [progress, setProgress] = useState( 100 )
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(( prevProgress ) => {
        if ( prevProgress < 0 ) {
          setDismissed( true )
          clearInterval( timer )
          return 100
        }
        return prevProgress - 10
      } )
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
            <LinearProgress variant="determinate" value={progress}/>
            <Typography>{t( 'update' ).newUpdateAvailable}</Typography>
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
            {t( 'update' ).later}
          </Button>
          <Button
            variant='outlined'
            component='button'
            onClick={update}
            disabled={refreshing}
          >
            {t( 'update' ).refresh}
          </Button>
        </>
      }
    />
  )
}

export default ServiceWorkerUpdateManager
