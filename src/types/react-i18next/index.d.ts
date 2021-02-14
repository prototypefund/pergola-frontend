import 'react-i18next'

// import all namespaces (for the default language, only)
import { resources } from 'i18n/i18n'

declare module 'react-i18next' {
  type DefaultResources = typeof resources['en'];
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Resources extends DefaultResources {}
}
