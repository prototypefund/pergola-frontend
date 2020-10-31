import { Device } from 'framework7/framework7-lite.esm.bundle.js'
import * as React from 'react'

import cordovaApp from '../js/cordova-app'
import routes from '../js/routes'
import WelcomePanel from './WelcomePanel'

export default class extends React.Component<
  any,
  { username: string; password: string }
> {
  constructor( props: any ) {
    super( props )

    this.state = {
      // Login screen demo data
      username: '',
      password: '',
    }
  }
  render() {
    return (
      <WelcomePanel />
    )
  }

}
