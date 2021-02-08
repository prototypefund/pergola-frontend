// @flow
import {gql, useQuery} from '@apollo/client'
import {Box, Button, Container, makeStyles, Paper, Typography} from '@material-ui/core'
import {AddCircle} from '@material-ui/icons'
import {useKeycloak} from '@react-keycloak/web'
import AvatarComponent from 'avataaars'
import dayjs from 'dayjs'
import * as React from 'react'
import {useSelector} from 'react-redux'
import { useHistory } from 'react-router-dom'

import {toNeo4jDateInput} from '../../helper'
import {RootState} from '../../reducers'
import {WateringTask} from '../../types/graphql'
import {CornerBadge} from '../basic'
import {toWateringTaskInfo} from './helper'

type Props = {
  onDrawerClose?: () => any
};

const GET_WATERING_TASK = gql`
    query WateringTask($date: _Neo4jDateInput) {
        WateringTask(filter:
        { date: $date }
        ) {
            _id
            date { day month year}
            users_assigned { _id id label }
            users_available { _id id label }
            wateringperiod {
                _id
                hasUsersAssigned
            }
        }
    }
`

export function WateringDetailDrawer( { onDrawerClose}: Props ) {
  const classes = useStyles()
  const { keycloak: { subject: userId } } = useKeycloak()
  const history = useHistory()
  const date = useSelector<RootState, Date>(( {letItRain: { selectedDate = new Date() }} ) => selectedDate )
  const {data: WateringTaskData} = useQuery<{ WateringTask: WateringTask[] }>( GET_WATERING_TASK, {
    variables: {
      date: toNeo4jDateInput( date )
    }
  } )

  const task = WateringTaskData?.WateringTask?.[0]
  const {
    itsMyTurn,
    inPeriod,
    iAmAvailable
  } = toWateringTaskInfo( task,  userId )

  const handleAssign = () => {
    console.log( 'assign' )
  }

  if( inPeriod ) {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h6'>{
          inPeriod ? '' : 'Leider noch planlos'
        }</Typography>
        <Box display='flex' flexDirection='row' justifyContent='center' minHeight='130px'>
          { ( task?.users_assigned || [] )
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
          {!itsMyTurn && inPeriod &&
          <Button
            startIcon={<AddCircle />}
            onClick={handleAssign}>
            Helfen!
          </Button>}
        </Box>
      </Paper>

    )
  } else {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h6'>Leider noch planlos</Typography>
        <Button
          variant='outlined'
          onClick={() => history.push( `/watering/availability/${dayjs( date ).format( 'YYYY-MM-DD' )}` ) }>
          <CornerBadge cornerActive={iAmAvailable} className={classes.cornerButton}>
            <div>
              <Typography>Du bist {!iAmAvailable && 'nicht'} verfügbar</Typography>
              <Typography style={{fontWeight: 'bold', textTransform: 'capitalize'}}>ändern</Typography>
            </div>
          </CornerBadge>
        </Button>
      </Paper>
    )
  }
};

const useStyles = makeStyles(() => ( {
  paper: {
    padding: '16px',
    minWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  cornerButton: {
    width: '100px',
    height: '100px'
  }
} ))

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
