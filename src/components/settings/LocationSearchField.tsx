import {
  createStyles,
  Fab,
  Grow,
  InputAdornment,
  makeStyles,
  TextField,
  Theme} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { debounce } from 'lodash'
import * as React from 'react'
import { ChangeEvent, MutableRefObject , useCallback,useEffect , useRef , useState  } from 'react'

import {geocode, NominatimResponse} from './nominatim'

const useStyles = makeStyles(( theme: Theme ) =>
  createStyles( {
    autoComplete: {
    },
    startAdornment: {
      marginTop: '0 !important'
    }
  } )
)

interface Props {
  onLocationFound?: ( lat: number, lng: number ) => void;
}

export const LocationSearchField = ( { onLocationFound }: Props ) => {
  const classes = useStyles()
  const [options, setOptions] = useState<
    Array<NominatimResponse>
    >( [] )
  const [searchString, setSearchString] = useState<string>( '' )


  const handleChange = useCallback(
    ( event: ChangeEvent<HTMLInputElement> ) =>
      setSearchString( event.currentTarget.value ),
    []
  )

  const onChange = useCallback(
    ( _, _value ) => {
      const value: NominatimResponse | null = _value
      if ( value && onLocationFound ) {
        onLocationFound( parseFloat( value.lat ), parseFloat( value.lon ))
      }
      setSearchString( '' )
    },
    [setSearchString]
  )

  useEffect(
    debounce(() => {
      geocode( {
        countrycodes: ['de', 'at', 'ch'],
        q: searchString
      } )
        .then(( results ) =>
          setOptions( results )
        )
        .catch(( error: Error ) => console.error( error ))
    }, 500 ),
    [searchString, setOptions]
  )

  return (
    <Autocomplete
      className={`${classes.autoComplete}`}
      id="search-place"
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.display_name
      }
      onChange={onChange}
      options={options}
      filterOptions={x => {
        return x
      }}
      autoComplete
      freeSolo
      renderInput={params => (
        <TextField
          {...params}
          label="Search for a location"
          variant="filled"
          fullWidth
          onChange={handleChange}
          autoFocus
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment
                className={classes.startAdornment}
                position="start"
              >
                <Search />
              </InputAdornment>
            )
          }}
        />
      )}
      renderOption={option => option.display_name}
    />
  )
}
