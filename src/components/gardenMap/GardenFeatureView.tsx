import {Box, IconButton, makeStyles, Paper, Theme, Typography} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import MDEditor from '@uiw/react-md-editor'
import * as React from 'react'

import {GardenFeature} from '../../types/graphql'

interface Props {
  gardenFeature?: GardenFeature,
  onEditToggle: () =>  any
}
export function GardenFeatureView( {gardenFeature, onEditToggle}: Props ) {
  const classes = useStyles()

  return (
    <Box>
      <Typography variant='h4' >
        <IconButton onClick={onEditToggle}>
          <Edit/>
        </IconButton>
        {gardenFeature?.label || 'new garden feature' }</Typography>
      <h1 />
      <MDEditor.Markdown source={gardenFeature?.infoText || ''} />

    </Box>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {} ))
