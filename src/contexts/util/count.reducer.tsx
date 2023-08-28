type Action = { type: 'INCREASE_NUM' };

export interface State {
  number: number;
}

export function countReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREASE_NUM': {
      state.number += 1;
      return state;
    }
    default:
      return state;
  }
}
