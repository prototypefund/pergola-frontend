import { Box ,makeStyles, Paper, Typography} from '@material-ui/core'
import React from 'react'

import { GardenMap } from '../components'
import {GardenFeatureDetail} from '../components/gardenMap'
import {useSelector} from '../reducers'



export function GardenOverviewPage() {
  const classes = useStyles()
  const selectedShapeId = useSelector(( { gardenMap: { selectedShapeId }} ) =>  selectedShapeId )

  return (
    <Box display='flex' flexGrow={1} className={classes.mainContainer + ' mapInfoWrapper'} component={'main'}>
      <div style={{flexGrow: 9}}>
        <GardenMap />
      </div>
      {selectedShapeId && <Paper className={'featureView'}><GardenFeatureDetail shapeId={selectedShapeId} /> </Paper>}
    </Box>
  )
}

const useStyles = makeStyles(() => ( {
  mainContainer: {
    //TODO: this absolute height is a hack, please correct it in parent components layout model
    height: 'calc(100vh - 162px)'  ,
    '& .featureView': {
      flexGrow: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    '@media (orientation: landscape)': {
      '&.mapInfoWrapper': {
        flexDirection: 'row'
      },
      '& .featureView': { maxWidth: '50%' },
    },
    '@media (orientation: portrait)': {
      '&.mapInfoWrapper': {
        flexDirection: 'column'
      },
      '& .featureView': { maxHeight: '50%' },
    }

  },
} ))
