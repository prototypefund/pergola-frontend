import {gql, useMutation, useQuery} from '@apollo/client'
import {
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography
} from '@material-ui/core'
import {PlayForWork} from '@material-ui/icons'
import dayjs from 'dayjs'
import * as React from 'react'
import {useState} from 'react'

import {fromNeo4jDate, toNeo4jDateInput} from '../../helper'
import {_Neo4jDateInput, MutationPlanWateringPeriodsArgs, WateringPeriod} from '../../types/graphql'

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
    mutation planWateringPeriod($planing_ahead: Int!, $periods_predefined: Int!) {
        planWateringPeriods(planing_ahead: $planing_ahead, periods_predefined: $periods_predefined)
    }
`

export function WateringPeriodManager() {
  const {data: wateringPeriodsData} = useQuery<{ WateringPeriod: WateringPeriod[] }, { date: _Neo4jDateInput }>( WATERING_PERIODS_QUERY, {
    variables: {date: toNeo4jDateInput( new Date())}
  } )
  const [planWateringPeriods] = useMutation<any, MutationPlanWateringPeriodsArgs>( PLAN_WATERING_PERIOD_MUTATION )
  const [periodsPredefined, setPeriodsPredefined] = useState( 0 )

  return (
    <div>
      <Paper>
        <Container>
          <FormGroup>
            <FormControlLabel label='amount of new periods created after calculation' control={
              <Input
                type='number'
                inputProps={{min: 0, max: 10}}
                value={periodsPredefined}
                onChange={e => setPeriodsPredefined( parseInt( e.target.value ) || periodsPredefined )}
              />}/>
          </FormGroup>
        </Container>
        <Container>
          <List>
            {wateringPeriodsData?.WateringPeriod.map( waterinPeriod => {
              const from = dayjs( fromNeo4jDate( waterinPeriod.from ))
              const till = dayjs( fromNeo4jDate( waterinPeriod.till ))
              return ( <ListItem key={waterinPeriod._id}>
                <ListItemText>{from.format( 'LL' )} - {till.format( 'LL' )}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton disabled={!!waterinPeriod.hasUsersAssigned}
                    onClick={() => waterinPeriod._id && planWateringPeriods( {
                      variables: {
                        planing_ahead: Math.ceil( from.diff( dayjs(), 'day' )),
                        periods_predefined: periodsPredefined
                      }
                    } )}>
                    <PlayForWork/></IconButton>
                </ListItemSecondaryAction>
              </ListItem> )
            } )}
          </List>
        </Container>
      </Paper>
    </div>
  )
}

