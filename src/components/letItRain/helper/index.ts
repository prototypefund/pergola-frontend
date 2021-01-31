import dayjs from 'dayjs'
import {KeycloakProfile} from 'keycloak-js'

import {fromNeo4jDate} from '../../../helper'
import {WateringTask} from '../../../types/graphql'


export interface WateringTaskInfo {
  date: dayjs.Dayjs;
  iAmAvailable: boolean;
  inPeriod: boolean;
  recruiterCount: number;
  itsMyTurn: boolean
}

export function toWateringTaskInfo( task?: WateringTask, userProfile?: KeycloakProfile ) {
  return {
    date:  dayjs( task?.date && fromNeo4jDate( task.date )),
    itsMyTurn: ( task?.users_assigned || [] ).findIndex(( user ) => user && userProfile?.username === user.label ) >= 0 ,
    iAmAvailable: ( task?.users_available || [] ).findIndex(( user ) => user && userProfile?.username === user.label ) >= 0 ,
    recruiterCount: task?.users_assigned?.length || 0,
    inPeriod: !!( task?.wateringperiod?.[0]?.hasUsersAssigned )
  }
}
