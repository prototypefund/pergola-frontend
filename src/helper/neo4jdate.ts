import {_Neo4jDate, _Neo4jDateInput} from '../types/graphql'

export const fromNeo4jDate: ( neoDate: _Neo4jDate  | _Neo4jDateInput ) => Date = neoDate => {
  const { day, month, year } = neoDate
  const date = new Date()
  date.setFullYear( year || date.getFullYear() , ( month || ( date.getMonth() + 1 )) - 1, day || date.getDate())
  return date
}

export const toNeo4jDateInput: ( date: Date ) => _Neo4jDateInput = date => ( {
  day: date.getDate(),
  month: date.getMonth() + 1,
  year: date.getFullYear(),
} )

export const equalsNeo4jDate: ( neoDate: _Neo4jDate, date: Date ) => Boolean = ( neoDate, date ) => (
  date.getDate() === neoDate.day &&
    date.getMonth() + 1 === neoDate.month &&
    date.getFullYear() === neoDate.year )

export const neo4jDateToInput: ( date:_Neo4jDate ) => _Neo4jDateInput = ( {day, month, year } ) => ( {day, month, year} )
