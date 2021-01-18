import {Container, makeStyles, Paper} from '@material-ui/core'
import * as React from 'react'
import { ReactNode } from 'react'

type Props = {
  children?: ReactNode;
};

export function PaperDrop( { children }: Props ) {
  const classes = useStyles()

  return (
    <div>
      <Container className={classes.drop}>
        <div
          className={[classes.drop__filler_dropleft, classes.drop__filler].join(
            ' '
          )}
        />
        <svg
          className={classes.drop_svg}
          width="100"
          height="100"
          viewBox="0 0 200 200"
        >
          <defs>
            <mask id="mask">
              <rect width="100%" height="100%" fill="#fff" />
              <g transform="translate(40 40) scale(5)">
                <path d="M 17.66,8 12,2.35 6.34,8 C 4.78,9.56 4,11.64 4,13.64 c 0,2 0.78,4.11 2.34,5.67 1.56,1.56 3.61,2.35 5.66,2.35 2.05,0 4.1,-0.79 5.66,-2.35 C 19.22,17.75 20,15.64 20,13.64 20,11.64 19.22,9.56 17.66,8 Z" />
              </g>
            </mask>
          </defs>
          <circle cx="100" cy="100" r="100px" fill="white" mask="url(#mask)" />
          <rect
            y="100"
            width="200"
            height="100"
            fill="white"
            mask="url(#mask)"
          />
        </svg>
        <div
          className={[
            classes.drop__filler_dropright,
            classes.drop__filler,
          ].join( ' ' )}
        />
      </Container>
      <Paper className={classes.paperlike}>{children}</Paper>
    </div>
  )
}

const useStyles = makeStyles(() => ( {
  paperlike: {
    borderRadius: '0 0 4px 4px',
    padding: '16px'
  },
  drop: {
    marginBottom: '0px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 0
  },
  drop_svg: {
    flexGrow: 0,
  },
  drop__filler: {
    flexGrow: 1,
    height: '50px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  drop__filler_dropleft: {
    borderRadius: '4px 0 0 0',
  },
  drop__filler_dropright: {
    borderRadius: '0 4px 0 0',
  },
} ))
