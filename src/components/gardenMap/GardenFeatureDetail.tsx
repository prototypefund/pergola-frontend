import { gql, useQuery } from '@apollo/client'
import { Box ,IconButton, makeStyles, Theme, Typography} from '@material-ui/core'
import {Close, Edit } from '@material-ui/icons'
import * as React from 'react'
import { useEffect,useState  } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import {DeselectShape} from '../../actions'
import { GardenFeature } from '../../types/graphql'
import {GardenFeatureCreator} from './GardenFeatureCreator'
import { GardenFeatureView } from './GardenFeatureView'

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
  const dispatch = useDispatch()
  const { t } = useTranslation( 'gardenPlan' )
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
    //!feature && setEditMode( true )
    setEditMode( false )
  }, [feature] )

  const handleSave = () => {
    setEditMode( false )
    try {
      !loading && refetch()
    } catch ( e ) {
      console.error( 'Cannot refetch!', e )
    }
  }


  return (
    <Box className={classes.mainContainer}>
      <IconButton onClick={() => dispatch( DeselectShape())}>
        <Close />
      </IconButton>
      <div className='inner'>
        {editMode
          ? <GardenFeatureCreator shapeId={shapeId} gardenFeature={feature} onSave={handleSave}/>
          : <GardenFeatureView gardenFeature={feature} onEditToggle={handleEditModeToggle}/>}
      </div>
    </Box>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  mainContainer: {
    overflow: 'auto',
    maxHeight: '100%',
    maxWidth: '100%',
    '& .inner': {
      marginLeft: theme.spacing( 4 ),
      marginRight: theme.spacing( 4 ),
    }
  }

} ))
