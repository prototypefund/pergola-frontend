import {FunctionComponent, SVGProps, useEffect, useState} from 'react'

import {ReactComponent as BeehiveOutline} from '../static/icons/beehive-outline.svg'

export interface FeatureType {
  name: string;
  icon?: string;
  svgIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export const featureTypes: FeatureType[] = [
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
