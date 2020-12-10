export enum GardenSelectActions {
  SELECT_GARDEN = 'SELECT_GARDEN',
}

interface GardenSelectActionType<T, P> {
  type: T;
  payload: P;
}

export type GardenSelectAction = GardenSelectActionType<
  typeof GardenSelectActions.SELECT_GARDEN,
  number
>;
