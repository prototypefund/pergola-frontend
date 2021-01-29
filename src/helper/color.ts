import {stringToHash} from './string'

export function stringToHSL( val: string ) {
  return numToHSL( stringToHash( val ))
}

export function numToHSL( num: number ) {
  return `hsl( ${num % 360} ,100%,30%)`
}
