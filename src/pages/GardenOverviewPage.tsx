import { Box ,makeStyles, Paper, Typography} from '@material-ui/core'
import React from 'react'

import { GardenMap } from '../components'
import {useSelector} from '../reducers'
import BackgroundImage from '../static/background_full_grey_02.jpg'



export function GardenOverviewPage() {
  const classes = useStyles()
  const selectedShapeId = useSelector(( { gardenMap: { selectedShapeId }} ) =>  selectedShapeId )

  return (
    <div className={classes.page}>
      <div style={{height: '100%'}}>
        <Box display='flex' height='100%' className='mapInfoWrapper' >
          <div style={{flexGrow: 9}}>
            <GardenMap />
          </div>
          {selectedShapeId && <Paper style={{flexGrow: 4, maxWidth: '50%'}}><Typography variant={'h1'} >Test </Typography>lorem {selectedShapeId} ipsum</Paper>}
        </Box>
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ( {
  page: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'fixed',
    height: '100%',
    '@media (orientation: landscape)': {
      '& .mapInfoWrapper': {
        flexDirection: 'row'
      }
    },
    '@media (orientation: portrait)': {
      '& .mapInfoWrapper': {
        flexDirection: 'column'
      }
    }

  },
} ))
