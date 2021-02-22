const hashCode: ( s: string ) => number = ( s: string ) => {
  return s.split( '' ).reduce( function ( a, b ) {
    a = (( a << 5 ) - a ) + b.charCodeAt( 0 )
    return a & a
  }, 0 )
}

const avatars = [
  {
    avatarStyle: 'Circle',
    topType: 'WinterHat2',
    accessoriesType: 'Blank',
    hatColor: 'Pink',
    facialHairType: 'Blank',
    clotheType: 'Overall',
    clotheColor: 'Gray01',
    eyeType: 'Happy',
    eyebrowType: 'Default',
    mouthType: 'Default',
    skinColor: 'Pale',
  },
  {
    avatarStyle: 'Circle',
    topType: 'ShortHairShortCurly',
    accessoriesType: 'Blank',
    hairColor: 'Platinum',
    facialHairType: 'Blank',
    clotheType: 'Overall',
    clotheColor: 'PastelRed',
    eyeType: 'Happy',
    eyebrowType: 'Default',
    mouthType: 'Default',
    skinColor: 'Brown',
  },
  {
    avatarStyle: 'Circle',
    topType: 'Hijab',
    accessoriesType: 'Blank',
    hatColor: 'Blue02',
    clotheType: 'Overall',
    clotheColor: 'PastelOrange',
    eyeType: 'WinkWacky',
    eyebrowType: 'Default',
    mouthType: 'Tongue',
    skinColor: 'Brown',
  },
  {
    avatarStyle: 'Circle',
    topType: 'LongHairStraight',
    accessoriesType: 'Blank',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    clotheType: 'BlazerShirt',
    eyeType: 'Default',
    eyebrowType: 'Default',
    mouthType: 'Default',
    skinColor: 'Light',
  }
]
export const getAvatarPropsForUser = ( id: string ) => {
  const avatarIndex = Math.floor( Math.abs( hashCode( id ))) % avatars.length
  return avatars[avatarIndex] || avatars[0]
}
