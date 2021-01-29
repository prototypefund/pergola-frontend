import dayjs from 'dayjs'

import {
  LetItRainActions,
  LetItRainDaySelectAction,
} from '../actions'
import createReducer from './createReducer'

export interface LetItRainStateType {
  selectedDate?: Date
}

export const letItRain = createReducer( {
  selectedDate: null
}, {
  [LetItRainActions.SELECT_DAY]( state: LetItRainStateType, action: LetItRainDaySelectAction ) {
    return {
      ...state,
      selectedDate: action.payload
    }
  },
  [LetItRainActions.NEXT_DAY]( state: LetItRainStateType ) {
    return {
      ...state,
      selectedDate: dayjs( state.selectedDate ).add( 1, 'day' ).toDate()
    }
  },
  [LetItRainActions.PREVIOUS_DAY]( state: LetItRainStateType ) {
    return {
      ...state,
      selectedDate: dayjs( state.selectedDate ).subtract( 1, 'day' ).toDate()
    }
  }
} )
