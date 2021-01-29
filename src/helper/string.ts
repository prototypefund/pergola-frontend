export function stringToHash( val: string ) {
  let hash = 0
  if ( val.length == 0 ) return hash
  for ( let i = 0; i < val.length; i++ ) {
    hash = val.charCodeAt( i ) + (( hash << 5 ) - hash )
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
