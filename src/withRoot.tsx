import { CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import * as React from 'react'

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
const theme = createMuiTheme( {
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
    fontSize: 18.594061,
    fontFamily: [
      'Open Sans',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join( ',' ),
    h2: {
      fontSize: '2.625rem',
      lineHeight: '1.483',
      fontFamily: headingsFontFamily,
    },
    h6: {
      textTransform: 'uppercase',
      fontSize: '1.15rem',
      fontWeight: 600,
      color: '#006f52', // TODO: use previous defined palette color
    },
  },
} )

export function withRoot( Component: any ) {
  function WithRoot( props: object ) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <ThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    )
  }

  return WithRoot
}
