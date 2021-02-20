import {GardenMapActions, GardenMapSelectShapeAction} from '../actions'
import createReducer from './createReducer'

export interface GardenMapStateType {
  selectedShapeId?: string
}

export const gardenMap = createReducer<GardenMapStateType>( {selectedShapeId: undefined},
  {
    [GardenMapActions.SELECT_SHAPE]( state: GardenMapStateType, action: GardenMapSelectShapeAction ) {
      return {
        ...state,
        selectedShapeId: action.payload
      }
    },
    [GardenMapActions.DESELECT_SHAPE]( state: GardenMapStateType ) {
      return {
        ...state,
        selectedShapeId: undefined
      }
    }
  }
)
