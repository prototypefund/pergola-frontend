import dayjs from 'dayjs'

import {fromNeo4jDate} from '../../../helper'
import {WateringTask} from '../../../types/graphql'


export interface WateringTaskInfo {
  date: dayjs.Dayjs;
  iAmAvailable: boolean;
  inPeriod: boolean;
  inPlannedPeriod: boolean;
  recruiterCount: number;
  itsMyTurn: boolean
}

export function toWateringTaskInfo( task?: WateringTask, userId?: string ): WateringTaskInfo {
  return {
    date:  dayjs( task?.date && fromNeo4jDate( task.date )),
    itsMyTurn: ( task?.users_assigned || [] ).findIndex(( user ) => user && userId === user.id ) >= 0 ,
    iAmAvailable: ( task?.users_available || [] ).findIndex(( user ) => user && userId === user.id ) >= 0 ,
    recruiterCount: task?.users_assigned?.length || 0,
    inPlannedPeriod: !!( task?.wateringperiod?.[0]?.hasUsersAssigned ),
    inPeriod: !!( task?.wateringperiod?.[0] )
  }
}
