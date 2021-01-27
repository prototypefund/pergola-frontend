import {makeStyles, Paper, Theme, Typography} from '@material-ui/core'
import * as React from 'react'

interface Props {
  className?: string;
  children?: React.ReactNode;
  cornerActive?: boolean;
}

export function CornerBadge( props: Props ) {
  const { children, className, cornerActive } = props
  const classes = useStyles( props )

  return (
    <span className={classes.root + ' ' + className}>
      {children}
      {cornerActive && <span className={classes.badge} />}
    </span>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  root: ( {cornerActive}: Props ) => ( {
    borderRadius: `4px ${cornerActive ? '0' : '4px'} 4px 4px`,
    display: 'inline-flex',
    position: 'relative',
    flexShrink: 0,
    verticalAlign: 'middle',
    overflow: 'hidden',
    alignItems: 'center'
  } ),
  badge: {
    top: '0',
    right: '0',
    transform: 'scale(1) translate(50%, -50%) rotateZ(45deg)',
    transformOrigin: '50% 50%',


    backgroundColor: 'black',

    height: '20px',
    padding: '0 6px',
    zIndex: 1,
    position: 'absolute',
    fontSize: '0.75rem',
    minWidth: '20px',
    boxSizing: 'border-box'
  }

} ))
