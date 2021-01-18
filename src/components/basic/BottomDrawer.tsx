import {Box, Drawer, DrawerProps, makeStyles, Theme} from '@material-ui/core'
import * as React from 'react'

interface Props extends DrawerProps {
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
}

export function BottomDrawer( { toolbar, children, ...props } : Props ) {
  const classes = useStyles()

  return (
    <Drawer
      variant="persistent"
      anchor="bottom"
      PaperProps={{style: {background: 'none'}}}
      {...props}
    >
      <Box className={classes.drawerToolbar} display='flex' flexDirection='row' justifyContent='space-between'>
        {toolbar}
      </Box>
      {children}
    </Drawer>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  drawerToolbar: {
    borderRadius: '15px 15px 0px 0px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText( theme.palette.primary.main ),
    fill: theme.palette.getContrastText( theme.palette.primary.main )
  },
} ))
