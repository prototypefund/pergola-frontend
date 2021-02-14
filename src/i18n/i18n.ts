import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import de from './de'
import en from './en'

export const resources = {
  en,
  de
} as const

i18n
  .use( LanguageDetector )
  .use( initReactI18next )
  .init( {
    ns: ['common', 'letItRain'],
    defaultNS: 'common',
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  } )
