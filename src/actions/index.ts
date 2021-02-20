import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { GardenSelectAction } from './garden-select'
import { GardenMapAction } from './gardenMap'
import { LetItRainAction} from './letItRain'
import { UserProfileAction } from './userProfile'

export * from './userProfile'
export * from './garden-select'
export * from './letItRain'
export * from './gardenMap'

export function useActions( actions: any, deps?: any ): any {
  const dispatch = useDispatch()
  return useMemo(
    () => {
      if ( Array.isArray( actions )) {
        return actions.map(( a ) => bindActionCreators( a, dispatch ))
      }
      return bindActionCreators( actions, dispatch )
    },
    deps ? [dispatch, ...deps] : deps
  )
}

export type Action = GardenSelectAction | UserProfileAction | LetItRainAction | GardenMapAction
