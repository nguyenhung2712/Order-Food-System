import React, { useCallback, useState } from 'react';
import { countReducer, State } from './count.reducer';
import { set } from 'lodash';

interface CountProviderState {
  increaseValue: () => void;
  number: number;
}

export const countContext = React.createContext<CountProviderState | undefined>(
  undefined
);

export const useCount = () => {
  const context = React.useContext(countContext);
  if (context === undefined) {
    throw new Error(`useCount must be used within a CountProvider`);
  }
  return context;
};

export const CountProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(countReducer, { number: 0 });

  const increaseValue = useCallback(
    () => {
      dispatch({ type: 'INCREASE_NUM' });
    },
    [
      /* state */
    ]
  );

  const value = React.useMemo(
    () => ({
      ...state,
      increaseValue,
    }),
    [state, increaseValue]
  );
  return <countContext.Provider value={value} {...props} />;
};
