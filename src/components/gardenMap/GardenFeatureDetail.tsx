import { gql, useQuery } from '@apollo/client'
import {IconButton, makeStyles, Paper, Theme, Typography} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import * as React from 'react'
import { useEffect,useState  } from 'react'

import { GardenFeature } from '../../types/graphql'
import {GardenFeatureCreator} from './GardenFeatureCreator'

interface Props {
  shapeId: string;
}

const GET_FEATURE_FOR_SHAPE =  gql`
query GardenFeature($shapeId: ID!) {
    GardenFeature(filter: {shape_some: {shapeId: $shapeId}}) {
        label
        plants
        featureId
        featureType
        infoText
        shape { shapeId }
    }
}
`

export function GardenFeatureDetail( { shapeId } : Props ) {
  const classes = useStyles()
  const {data: featureData, loading, refetch } = useQuery<{GardenFeature: GardenFeature[]}, {shapeId: string}>( GET_FEATURE_FOR_SHAPE, {
    variables: {
      shapeId
    }
  } )

  const handleEditModeToggle = () => {
    setEditMode( !editMode )
  }

  const feature = featureData?.GardenFeature?.[0]
  const [editMode, setEditMode] = useState( false )
  console.log( {feature} )

  useEffect(() => {
    !feature && setEditMode( true )
  }, [feature] )

  const handleSave = () => {
    setEditMode( false )
    try {
      !loading && refetch()
    } catch ( e ) {
      console.error( 'Cannot refetch!', e )
    }
  }

  const GardenFeatureView  = () => (
    <Typography variant='h4' >
      <IconButton color={editMode ? 'primary' : undefined} onClick={handleEditModeToggle}>
        <Edit/>
      </IconButton>
      {feature?.label || 'new garden feature' }</Typography>
  )


  return (
    <div className={classes.mainContainer}>
      {editMode
        ? <GardenFeatureCreator shapeId={shapeId} gardenFeature={feature} onSave={handleSave}/>
        : <GardenFeatureView />}
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  mainContainer: {
    padding: '16px'
  }

} ))
