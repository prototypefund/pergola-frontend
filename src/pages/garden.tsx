import { List, Navbar, Page } from 'framework7-react'
import React from 'react'

import OSMBuildingsMap from '../components/OSMBuildingsMap'

export default function Component() {
  return (
    <Page name="garden">
      <Navbar title="Garden" />
      <OSMBuildingsMap />
      <List />
    </Page>
  )
}
