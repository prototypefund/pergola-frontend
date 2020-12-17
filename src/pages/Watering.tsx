import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useKeycloak } from '@react-keycloak/web'

export function Watering() {
  const { keycloak } = useKeycloak()
  const GET_WATERINGTASK = keycloak.hasRealmRole("developer") ?
    gql`
      {
        WateringTask {
          label
          users_assigned {
            label
          }
        }
      }
    ` :
    gql`
      {
        WateringTask {
          label
        }
      }
    `
  const { loading, data, error } = useQuery(GET_WATERINGTASK)

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && console.log(error) && <p>Error</p>}
      {data && !loading && !error && (
        <div>
          <p> {JSON.stringify(data)} </p>
      </div>
      )}
    </div>
  )
}
