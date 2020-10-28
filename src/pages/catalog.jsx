import {List, Navbar, Page} from 'framework7-react'
import React from 'react'

import GardenMap from '../components/GardenMap'

export default function Component() {
  return (
    <Page name="catalog">
      <Navbar title="Catalog"/>
      <GardenMap/>
      <List />
    </Page>
  )
}
