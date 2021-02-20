import {useKeycloak} from '@react-keycloak/web'
import * as React from 'react'

import {LoginPrompt} from '../components/LoginPrompt'

export function Settings() {
  const { keycloak } = useKeycloak()

  return keycloak.authenticated ?
    (
      <>
      </>
    ) : 
    (
      <LoginPrompt />
    )
}
