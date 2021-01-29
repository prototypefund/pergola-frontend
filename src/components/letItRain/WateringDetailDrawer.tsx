// @flow
import {gql, useQuery} from '@apollo/client'
import {Box, Button, Container, Typography} from '@material-ui/core'
import {AddCircle} from '@material-ui/icons'
import AvatarComponent from 'avataaars'
import {KeycloakProfile} from 'keycloak-js'
import * as React from 'react'
import {useSelector} from 'react-redux'

import {toNeo4JDate} from '../../helper'
import {RootState} from '../../reducers'
import {WateringTask} from '../../types/graphql'

type Props = {
  onDrawerClose?: () => any
};

const GET_WATERING_TASK = gql`
    query WateringTask($date: _Neo4jDateInput) {
        WateringTask(filter:
        { date: $date }
        ) {
            date { day month year}
            users_assigned { label }
            users_available { label }
        }
    }
`

export function WateringDetailDrawer( { onDrawerClose}: Props ) {
  const date = useSelector<RootState, Date>(( {letItRain: { selectedDate = new Date() }} ) => selectedDate )
  const {data: WateringTaskData} = useQuery<{ WateringTask: WateringTask[] }>( GET_WATERING_TASK, {
    variables: {
      date: toNeo4JDate( date )
    }
  } )
  const userProfile = useSelector<RootState, KeycloakProfile | null>(( {userProfile} ) => userProfile )

  const { users_assigned = [] } = WateringTaskData?.WateringTask?.[0] || {}
  const itsMyTurn = ( users_assigned || [] ).findIndex(( user ) => user && userProfile?.username === user?.label ) >= 0


  const handleAssign = () => {
    console.log( 'assign' )
  }

  return (
    <div style={{backgroundColor: 'white'}}>
      <Container>
        <Box display='flex' flexDirection='row' justifyContent='center' minHeight='130px'>
          { ( users_assigned || [] )
            .map( user => user && (
              <Box key={user._id} display='flex' flexDirection='column' alignItems='center' justifyContent='center' margin='8px'>
                <AvatarComponent
                  style={{width: '100px', height: '100px'}}
                  {...randomAvatarProps()}
                />
                <Typography  variant='h5'>{user.label}</Typography>
              </Box>
            )
            )
          }
          {!itsMyTurn &&
            <Button
              startIcon={<AddCircle />}
              onClick={handleAssign}>
            Helfen!
            </Button>}
        </Box>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <Button style={{color: 'red'}} > absagen</Button>
          <Button onClick={onDrawerClose}>zurück</Button>
        </Box>
      </Container>
    </div>
  )
};

const randomAvatarProps = () =>
  avatars[ Math.floor( Math.random()*avatars.length ) ]

const avatars = [
  {
    avatarStyle:'Circle',
    topType:'WinterHat2',
    accessoriesType:'Blank',
    hatColor:'Pink',
    facialHairType:'Blank',
    clotheType:'Overall',
    clotheColor:'Gray01',
    eyeType:'Happy',
    eyebrowType:'Default',
    mouthType:'Default',
    skinColor:'Pale',
  },
  {
    avatarStyle:'Circle',
    topType:'ShortHairShortCurly',
    accessoriesType:'Blank',
    hairColor:'Platinum',
    facialHairType:'Blank',
    clotheType:'Overall',
    clotheColor:'PastelRed',
    eyeType:'Happy',
    eyebrowType:'Default',
    mouthType:'Default',
    skinColor:'Brown',
  },
  {
    avatarStyle:'Circle',
    topType:'Hijab',
    accessoriesType:'Blank',
    hatColor:'Blue02',
    clotheType:'Overall',
    clotheColor:'PastelOrange',
    eyeType:'WinkWacky',
    eyebrowType:'Default',
    mouthType:'Tongue',
    skinColor:'Brown',
  },
  {
    avatarStyle:'Circle',
    topType:'LongHairStraight',
    accessoriesType:'Blank',
    hairColor:'BrownDark',
    facialHairType:'Blank',
    clotheType:'BlazerShirt',
    eyeType:'Default',
    eyebrowType:'Default',
    mouthType:'Default',
    skinColor:'Light',
  }
]
