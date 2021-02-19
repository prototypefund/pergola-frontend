import {gql, useMutation, useQuery } from '@apollo/client'
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Paper, Theme, Typography} from '@material-ui/core'
import { PlayForWork } from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'

import {fromNeo4jDate, toNeo4jDateInput} from '../../helper'
import {_Neo4jDateInput, WateringPeriod} from '../../types/graphql'

const WATERING_PERIODS_QUERY = gql`
query WateringPeriod($date: _Neo4jDateInput) {
    WateringPeriod(filter: {till_gte: $date}) {
        _id
        hasUsersAssigned
        from { year month day}
        till { year month day}
    }
}
`

const PLAN_WATERING_PERIOD_MUTATION = gql`
mutation planWateringPeriod($periodId: String!) {
    planWateringPeriod(periodId: $periodId)
}
`

export function WateringPeriodManager() {
  const classes = useStyles()
  const {data: wateringPeriodsData } = useQuery<{WateringPeriod: WateringPeriod[]}, {date: _Neo4jDateInput}>( WATERING_PERIODS_QUERY, {
    variables: { date: toNeo4jDateInput( new Date()) }
  } )
  const [planWateringPeriod] = useMutation<any, {periodId: string}>( PLAN_WATERING_PERIOD_MUTATION )

  return (
    <div>
      <Paper>
        <List>
          {wateringPeriodsData?.WateringPeriod.map( waterinPeriod => {
            const from = dayjs( fromNeo4jDate( waterinPeriod.from ))
            const till = dayjs( fromNeo4jDate( waterinPeriod.till ))
            return ( <ListItem key={waterinPeriod._id}>
              <ListItemText>{from.format( 'LL' )} - {till.format( 'LL' )}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton disabled={!!waterinPeriod.hasUsersAssigned} onClick={() => waterinPeriod._id && planWateringPeriod( {variables: {periodId: waterinPeriod._id}} )} ><PlayForWork/></IconButton>
              </ListItemSecondaryAction>
            </ListItem> )
          } )}
        </List>
      </Paper>
    </div>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {} ))
