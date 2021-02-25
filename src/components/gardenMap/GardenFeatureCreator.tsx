import {gql, useMutation} from '@apollo/client'
import {
  Box,
  Chip,
  FormControl,
  FormGroup,
  Icon,
  IconButton,
  Input,
  makeStyles,
  SvgIcon,
  Theme,
  Typography} from '@material-ui/core'
import { Save } from '@material-ui/icons'
import MDEditor from '@uiw/react-md-editor'
import * as React from 'react'
import {FunctionComponent, SVGProps, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {ReactComponent as BeehiveOutline} from '../../static/icons/beehive-outline.svg'
import {
  GardenFeature,
  MutationAddGardenFeatureShapeArgs,
  MutationCreateGardenFeatureArgs,
  MutationUpdateGardenFeatureArgs
} from '../../types/graphql'


const featureTypes: FeatureType[] = [
  {
    name: 'beet',
    icon: 'icofont icofont-fruits'
  },
  {
    name: 'greenhouse',
    icon: 'icofont icofont-ui-home'
  },
  {
    name: 'garden shed',
    icon: 'icofont icofont-home'
  },
  {
    name: 'fireplace',
    icon: 'icofont icofont-fire-burn'
  },
  {
    name: 'hive',
    svgIcon: BeehiveOutline
  }
]

const availablePlants = [
  'apple', 'artichoke', 'bell-pepper-capsicum', 'broccoli', 'cherry', 'corn', 'grapes', 'egg-plant', 'raddish', 'potato', 'tomato', 'wheat', 'strawberry', 'watermelon', 'pear', 'pepper', 'pumpkin', 'peas', 'mushroom', 'kiwi', 'cauli-flower', 'plant'
]

interface Props {
  shapeId: string,
  gardenFeature?: GardenFeature,
  onSave?: () =>  any
}

interface FeatureType {
  name: string;
  icon?: string;
  svgIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

const UPDATE_GARDEN_FEATURE_MUTATION = gql`
mutation UpdateGardenFeature($featureId: ID!, $featureType: String, $label: String, $infoText: String, $plants: [String]) {
    UpdateGardenFeature(featureId: $featureId,  label: $label, featureType:  $featureType, infoText: $infoText, plants: $plants) {
        _id
        featureId
        label
        shape { shapeId } 
        infoText
    }
}
`

const CREATE_GARDEN_FEATURE_MUTATION = gql`
    mutation CreateGardenFeature($featureType: String!, $label: String!, $infoText: String!, $plants: [String]! ) {
        CreateGardenFeature(featureType: $featureType, infoText: $infoText, label: $label, plants: $plants) {
            featureId
        }
    }
`

const ADD_GARDEN_FEATURE_SHAPE_MUTATION = gql`
    mutation addGardenFeatureShape($from: _GardenFeatureInput!, $to: _GeoShapeInput!) {
        AddGardenFeatureShape(from: $from, to: $to) {
            from { featureId }
            to { shapeId }
        }
    }
`



export function GardenFeatureCreator( {shapeId, gardenFeature, onSave}: Props ) {
  const classes = useStyles()
  const {t} = useTranslation( 'gardenPlan' )
  const {t: tc} = useTranslation()
  const [selectedFeatureType, setSelectedFeatureType] = useState<FeatureType | undefined | null>( featureTypes.find( _t =>  _t.name === gardenFeature?.featureType ))
  const [plants, setPlants] = useState( gardenFeature?.plants || [] )
  const [featureLabel, setFeatureLabel] = useState( gardenFeature?.label || '' )
  const [infoText, setInfoText] = useState<string>( gardenFeature?.infoText || '' )
  const [featureId, setFeatureId] = useState<string | undefined | null>( gardenFeature?.featureId )

  const [createGardenFeature] =
    useMutation<{ CreateGardenFeature: { featureId: string } }, MutationCreateGardenFeatureArgs>( CREATE_GARDEN_FEATURE_MUTATION, {
      variables: {
        plants,
        label: featureLabel,
        featureType: selectedFeatureType?.name || 'arbitrary',
        infoText
      }
    } )
  const [updateGardenFeature] =
    useMutation<{ UpdateGardenFeature: GardenFeature }, MutationUpdateGardenFeatureArgs>( UPDATE_GARDEN_FEATURE_MUTATION, {
      variables: {
        plants,
        featureId: featureId || '',
        label: featureLabel,
        featureType: selectedFeatureType?.name || 'arbitrary',
        infoText
      }
    } )
  const [addGardenFeatureShape] =
    useMutation<{ addGardenFeatureShape: { from: { featureId: string }, to: { shapeId: string } } }, MutationAddGardenFeatureShapeArgs>( ADD_GARDEN_FEATURE_SHAPE_MUTATION )

  const createOrUpdateFeature = async () => {
    if( !featureId ) {
      const {data: featureData } = await createGardenFeature()
      const _featureId = featureData?.CreateGardenFeature?.featureId
      const result = _featureId && await addGardenFeatureShape( { variables: {
        from: { featureId: _featureId },
        to: { shapeId }
      }} )
      setFeatureId( _featureId )
      return result
    } else {
      return updateGardenFeature && await updateGardenFeature()
    }

  }

  /*useEffect(() => {
    createOrUpdateFeature().catch( e => {
      console.error( 'Cannot create or update garden feature', e )
    } )
  }, [featureId, featureLabel, selectedFeatureType] )*/


  const handleSave = () => {
    createOrUpdateFeature()
      .catch( e => console.error( 'cannot save or update feature', e ))
      .then(() => {
        onSave && onSave()
      } )
  }


  const togglePlant = ( plant ) => {
    plants.includes( plant )
      ? setPlants( plants.filter( p => p !== plant ))
      : setPlants( [...plants, plant] )
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='start' className={classes.mainContainer}>
      <IconButton onClick={handleSave}>
        <Save/>
      </IconButton>
      <FormGroup row>
        <FormControl>
          <Input
            placeholder={'Label'}
            inputProps={{className: classes.labelInput}}
            value={featureLabel}
            onChange={e => setFeatureLabel( e.target.value )}/>
        </FormControl>
      </FormGroup>
      <Typography variant={'h5'}>
        {t( 'feature' ).whatType}<br/>
      </Typography>
      <div className={classes.chipsContainer}>
        {featureTypes.map(( featureType ) => {
          const {name, icon, svgIcon} = featureType
          // @ts-ignore
          const label = t( `feature.types.${name}` ) || name
          return (
            <Chip
              onClick={() => setSelectedFeatureType( featureType )}
              color={selectedFeatureType?.name === name && 'primary' || undefined}
              key={name}
              label={label}
              icon={icon
                ? <Icon className={icon}/>
                : ( svgIcon
                  ? <SvgIcon component={svgIcon}/>
                  : undefined )}/>
          )
        } )}
      </div>
      {( selectedFeatureType?.name === 'beet' ) && <>
        <Typography variant={'h5'}>
          {t( 'feature' ).whatPlanted}<br/>
        </Typography>
        <div className={classes.chipsContainer}>
          {availablePlants.map( plant => {
          // @ts-ignore
            const label = t( `plants.${plant}` ) || plant
            return ( <Chip
              key={plant}
              color={plants.includes( plant ) ? 'primary' : undefined}
              onClick={() => togglePlant( plant )}
              label={label}
              icon={<Icon className={'icofont icofont-' + plant}
              />}/> )
          } )}
        </div> </>}
      <Typography variant={'h5'}>
        {t( 'feature' ).moreInfo}<br/>
      </Typography>
      <div  style={{width: '100%'}}>
        <MDEditor style={{background: 'none'}}  value={infoText} onChange={v => setInfoText( v || '' )} />
      </div>

    </Box>
  )
}

const useStyles = makeStyles(( theme: Theme ) => ( {
  mainContainer: {
    width: '100%',
    '& > *': {
      margin: theme.spacing( 1 ),
    }
  },
  chipsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing( 0.5 ),
    },
  },
  labelInput: theme.typography.h4,
} ))
