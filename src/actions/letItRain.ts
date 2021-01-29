export enum LetItRainActions {
  SELECT_DAY = 'SELECT_DAY',
  NEXT_DAY = 'NEXT_DAY',
  PREVIOUS_DAY = 'PREVIOUS_DAY',
  TEST_ACTION = 'TEST_ACTION'
}

interface LetItRainActionType<T, P> {
  type: T;
  payload: P;
}

export type LetItRainDaySelectAction = LetItRainActionType<
  typeof LetItRainActions.SELECT_DAY,
  Date >;

export type LetItRainNextDayAction = LetItRainActionType<typeof LetItRainActions.NEXT_DAY, undefined>
export type LetItRainPreviousDayAction = LetItRainActionType<typeof LetItRainActions.PREVIOUS_DAY, undefined>


export function selectDay( date: Date ): LetItRainDaySelectAction {
  return { type: LetItRainActions.SELECT_DAY,
    payload: date
  }
}

export function nextDay() : LetItRainNextDayAction {
  return { type: LetItRainActions.NEXT_DAY, payload: undefined}
}

export function previousDay() : LetItRainPreviousDayAction {
  return { type: LetItRainActions.PREVIOUS_DAY, payload: undefined}
}

