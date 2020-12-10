import { History } from 'history'
import { combineReducers } from 'redux'

//export interface RootState {
//  garden: number
//}

//We pass over the history object because some reducer might need it

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reducers = ( history: History ) => combineReducers( {} )

export default reducers
