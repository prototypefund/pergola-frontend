import {_Neo4jDate} from '../types/graphql'

export const fromNeo4JDate: ( neoDate: _Neo4jDate ) => Date = neoDate => {
  const { day, month, year } = neoDate
  const date = new Date()
  date.setFullYear( year || date.getFullYear() , ( month || ( date.getMonth() + 1 )) - 1, day || date.getDate())
  return date
}

export const toNeo4JDate: ( date: Date ) => _Neo4jDate = date => ( {
  day: date.getDate(),
  month: date.getMonth() + 1,
  year: date.getFullYear(),
} )

export const equalsNeo4jDate: ( neoDate: _Neo4jDate, date: Date ) => Boolean = ( neoDate, date ) => (
  date.getDate() === neoDate.day &&
    date.getMonth() + 1 === neoDate.month &&
    date.getFullYear() === neoDate.year )

