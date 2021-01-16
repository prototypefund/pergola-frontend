import ICAL from 'ical.js'
import * as React from 'react'
import { createClient } from 'webdav'

import { Event, JCal,VEvent } from './ical.types'

interface JCalHandlerFn {
  ( jcal: JCal ): any
}

async function loadCalDav( {root, path}, callback:JCalHandlerFn ) {
  const client = createClient( root )
  const iCalendarData = await client.getFileContents( path, {format: 'text'} )
  const jcalData = ICAL.parse( iCalendarData )
  callback( jcalData )
}


interface ReactChildObject {
  props: any
}

interface CalDavProps {
  children: ReactChildObject
  loader?: React.ReactNode
  root: string
  path: string
}

export function CalDav( props:CalDavProps ) {
  const [jcalData, setJcalData] = React.useState()
  const [loading, setLoading] = React.useState( false )

  if( !jcalData && ! loading ) {
    setLoading( true )
    loadCalDav( props, jcal => {
      setJcalData( jcal )
      setLoading( false )
    } ).catch()
  }

  return (
    <>
      {loading && props.loader}
      { {...props.children,
        props: {...props.children.props,
	         /** We pass through the jcalData for usage with arbitrary children.
		  *  For trivial usage of rsuite.Calendar as child, renderCell is wrapped. **/ 
          renderCell: ( date:Date ) => props.children.props.renderCell( date, jcalData ) }}}
    </>
  )
}


export function getEventsOfDay( date:Date, jcalData:JCal ):Event[] {
  if( !jcalData?.length ) return []
  const comp = new ICAL.Component( jcalData )
  const vevents = comp.getAllSubcomponents( 'vevent' )
  const events = vevents.map(( vevent:VEvent ) => new ICAL.Event( vevent ))
  return events.filter(( event:Event ) => event.startDate.toJSDate().toDateString() === date.toDateString())
}
