// @flow
import {gql, useMutation, useQuery, useSubscription} from '@apollo/client'
import {Box, Button, Container, IconButton, makeStyles, Paper, Typography} from '@material-ui/core'
import {AddCircle, RemoveCircleOutlined} from '@material-ui/icons'
import {useKeycloak} from '@react-keycloak/web'
import AvatarComponent from 'avataaars'
import dayjs from 'dayjs'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {Link, useHistory, useParams, useRouteMatch} from 'react-router-dom'

import {toNeo4jDateInput} from '../../helper'
import {RootState} from '../../reducers'
import {_Neo4jDateInput, User, WateringTask} from '../../types/graphql'
import {ConfirmationDialog,CornerBadge} from '../basic'
import {toWateringTaskInfo} from './helper'

type Props = {
  onDrawerClose?: () => any
};

const GET_WATERING_TASK = gql`
    query WateringTask($gardenId: ID!, $date: _Neo4jDateInput) {
        WateringTask(filter:
        {AND: [
            { wateringperiod: { at: {gardenId: $gardenId } } }
            { date: $date }
        ]}
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

const REMOVE_ASSIGNMENT_MUTATION = gql`
    mutation removeAssignment($date: _Neo4jDateInput!) {
        removeAssignment(date: $date)
    }
`

const ADD_ASSIGNMENT_MUTATION = gql`
    mutation addAssignment($date: _Neo4jDateInput!) {
        addAssignment(date: $date)
    }
`
const WATERING_TASK_CHANGE = gql`
    subscription {
        WateringTaskChange
    }
`

export function WateringDetailDrawer( {onDrawerClose}: Props ) {
  const {t} = useTranslation( 'letItRain' )
  const classes = useStyles()
  const {keycloak: {subject: userId}} = useKeycloak()
  const { gardenId } = useParams<{gardenId: string}>()
  const { url } = useRouteMatch()
  const date = useSelector<RootState, Date>(( {letItRain: {selectedDate = new Date()}} ) => selectedDate )
  const {data: WateringTaskData, loading, refetch} = useQuery<{gardenId: string, WateringTask: WateringTask[] }>( GET_WATERING_TASK, {
    variables: {
      gardenId,
      date: toNeo4jDateInput( date )
    }
  } )
  const { data: WateringTaskChangeData } = useSubscription<{WateringtaskChange: Boolean}>( WATERING_TASK_CHANGE )
  useEffect(() => { WateringTaskData && !loading && refetch() }, [WateringTaskChangeData] )

  const [removeAssignment] = useMutation<boolean, { date: _Neo4jDateInput }>( REMOVE_ASSIGNMENT_MUTATION, {
    variables: {
      date: toNeo4jDateInput( date )
    }
  } )
  const [addAssignment] = useMutation<boolean, { date: _Neo4jDateInput }>( ADD_ASSIGNMENT_MUTATION, {
    variables: {
      date: toNeo4jDateInput( date )
    }
  } )
  const [confirmRemoveAssignmentDialogOpen, setConfirmRemoveAssignmentDialogOpen] = useState( false )

  const task = WateringTaskData?.WateringTask?.[0]
  const {
    itsMyTurn,
    inPeriod,
    iAmAvailable
  } = toWateringTaskInfo( task, userId )

  const handleAssign = async () => {
    await addAssignment()
  }

  const isMe: ( user: User ) => Boolean = user => userId === user.id

  const handleConfirmRemoval = async ( remove?: boolean ) => {
    setConfirmRemoveAssignmentDialogOpen( false )
    if ( !remove ) return
    await removeAssignment()
  }

  if ( inPeriod ) {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h5' className={classes.detailTitle}>{
          inPeriod ? '' : t( 'watering.planless' )
        }</Typography>
        <Box display='flex' flexDirection='row' justifyContent='center' minHeight='130px'>
          {( task?.users_assigned || [] )
            .map( user => user && (
              <Box
                key={user._id}
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                margin='8px'
                border={isMe( user ) && 'solid 1px black'} borderRadius='8px'>
                {isMe( user ) && ( <IconButton
                  onClick={() => setConfirmRemoveAssignmentDialogOpen( true )}><RemoveCircleOutlined/></IconButton> )}
                <AvatarComponent
                  style={{width: '100px', height: '100px'}}
                  {...randomAvatarProps()}
                />
                <Typography variant='h5'>{user.label}</Typography>
              </Box>
            )
            )
          }
          {!itsMyTurn && inPeriod && <Button
            startIcon={<AddCircle/>}
            onClick={handleAssign}>
            {t( 'watering.help' )}
          </Button>}
        </Box>
        <ConfirmationDialog title={t( 'assignment' ).confirmRemoveTitle} keepMounted={false}
          open={confirmRemoveAssignmentDialogOpen}
          okContent={t( 'assignment' ).callOff}
          onClose={handleConfirmRemoval}>{t( 'assignment' ).confirmRemoveContent}</ConfirmationDialog>
      </Paper>

    )
  } else {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h5' className={classes.detailTitle}>{t( 'watering.planless' )}</Typography>
        <Button
          variant='outlined'
          component={Link}
          to={`${url}/availability/${dayjs( date ).format( 'YYYY-MM-DD' )}`} >
          <CornerBadge cornerActive={iAmAvailable} className={classes.cornerButton}>
            <div>
              <Typography
                variant='body2'>{iAmAvailable ? t( 'watering.uRAvailable' ) : t( 'watering.uRNotAvailable' )} </Typography>
              <Typography style={{fontWeight: 'bold', textTransform: 'capitalize'}}>{t( 'watering.change' )}</Typography>
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
  },
  detailTitle: {
    marginBottom: '.5rem'
  }
} ))

const randomAvatarProps = () =>
  avatars[Math.floor( Math.random() * avatars.length )]

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
