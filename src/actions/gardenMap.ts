export enum GardenMapActions {
  SELECT_SHAPE = 'SELECT_SHAPE',
  DESELECT_SHAPE = 'DESELECT_SHAPE'
}

interface GardenMapActionType<T, P> {
  type: T;
  payload: P;
}

export type GardenMapSelectShapeAction = GardenMapActionType<typeof GardenMapActions.SELECT_SHAPE, string>

export function SelectShape( shapeId: string ): GardenMapSelectShapeAction {
  return {
    type: GardenMapActions.SELECT_SHAPE,
    payload: shapeId
  }
}

export type GardenMapDeselectShapeAction = GardenMapActionType<typeof GardenMapActions.DESELECT_SHAPE, undefined>

export function DeselectShape(): GardenMapDeselectShapeAction {
  return {
    type: GardenMapActions.DESELECT_SHAPE,
    payload: undefined
  }
}


export type GardenMapAction = GardenMapSelectShapeAction | GardenMapDeselectShapeAction
