import { useState } from 'react';

export type UseBooleanData = {
  changeToTrue: () => void;
  changeToFalse: () => void;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useBoolean(initialState?: boolean) {
  const [state, setState] = useState(initialState || false);
  
  function changeToFalse() {
    setState(false);
  }

  function changeToTrue() {
    setState(true);
  }

  return {
    changeToTrue,
    changeToFalse,
    state,
    setState
  };
}