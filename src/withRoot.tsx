import { CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import * as React from 'react'

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
