import { CssBaseline } from '@material-ui/core'
import { createMuiTheme, responsiveFontSizes  } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import * as React from 'react'
import { Router } from 'react-router-dom'

import {history} from './configureStore'
import ServiceWorkerUpdateManager from './ServiceWorkerUpdateManager'

const headingsFontFamily = [
  'oswald',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join( ',' )

// A theme with custom primary and secondary color.
// It's optional.
let theme = createMuiTheme( {
  palette: {
    primary: {
      light: '#b1e5d6',
      main: '#009e7e',
      dark: '#006f52',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffbd4e',
      main: '#eb8d17',
      dark: '#b35f00',
      contrastText: '#fff',
    },
    grey: {
      '200': '#eee', // light
      '400': '#bdbdbd', // main
      '800': '#424242', // dark
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: [
      'Open Sans',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join( ',' ),
    body1: {
      fontSize: '1rem',
    },
    body2: {
      // Body tag font size!
      fontSize: '.875rem',
    },
    h1: {
      fontSize: '5.5625rem',
      fontFamily: headingsFontFamily,
    },
    h2: {
      fontSize: '3.4375rem',
      fontFamily: headingsFontFamily,
    },
    h3: {
      fontSize: '2.75rem',
      fontFamily: headingsFontFamily,
    },
    h4: {
      fontSize: '1.9375rem',
      fontFamily: headingsFontFamily,
    },
    h5: {
      textTransform: 'uppercase',
      fontSize: '1.375rem',
      fontFamily: headingsFontFamily,
    },
    h6: {
      textTransform: 'uppercase',
      fontSize: '1.125rem',
      fontFamily: headingsFontFamily,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700
    },
    caption: {
      fontSize: '.625rem',
    },
    subtitle1: {
      fontSize: '.9375rem',
      fontFamily: headingsFontFamily,
    },
    subtitle2: {
      fontSize: '.8125rem',
      fontFamily: headingsFontFamily,
    }
  },
  overrides: {
    MuiDialogContent: {
      root: {
        '@media (max-width:320px)': {
          padding: '0 1rem',
        },
      },
    },
    MuiDialogActions: {
      root: {
        padding: 0
      }
    },
    MuiFilledInput: {
      root: {
        backgroundColor: 'white!important',
      },
    },
    MuiSlider: {
      root: {
        width: '75%',
        height: '10px',
        margin: '2rem 0 0',
      },
      rail: {
        height: '10px',
        '&:before,&:after': {
          content: '""',
          position: 'absolute',
          display: 'inline-block',
          width: '12px',
          height: '10px',
          borderRadius: '5px',
        },
        '&:before': {
          left: '-4px',
          background: 'currentColor'
        },
        '&:after': {
          right: '-9px',
          background: 'currentColor'
        }
      },
      track: {
        height: '10px',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: '-4px',
          display: 'inline-block',
          width: '12px',
          height: '10px',
          borderRadius: '5px',
          background: 'currentColor'
        }
      },
      mark: {
        width: '4px',
        height: '4px',
        marginTop: '3px',
        borderRadius: '100%',
      },
      thumb: {
        width: '18px',
        height: '18px',
        marginTop: '-4px',
        border: '2px solid #fff',
      },
      valueLabel: {
        left: 'calc(-50% - 2px)'
      }
    }
  }
} )

theme = responsiveFontSizes( theme )

export function withRoot( Component: any ) {
  function WithRoot( props: object ) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <ThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ServiceWorkerUpdateManager/>
        <Router history={history}>
          <Component {...props} />
        </Router>
      </ThemeProvider>
    )
  }

  return WithRoot
}
