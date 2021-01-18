import {Box, makeStyles, Theme, Typography} from '@material-ui/core'
import * as React from 'react'

interface Props {
  title?: string
  children?: React.ElementType;
}

export function PageTitle( { title, children }: Props ) {
  const classes = useStyles()

  return (
    <Box textAlign='center'>
      <Typography variant='h4' className={classes.title}>{title || children}</Typography>
      <hr className={classes.titleDivider} />
    </Box>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  titleDivider: {
    height: 0,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    borderWidth: '2pt',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2pt',
    fontWeight: 'normal',
    width: '25px'
  },
  title: {
    fontFamily: 'Oswald'
  },
} ))
