import React, { createContext, useReducer } from "react";

export type ReducerProps = {
  payload: any;
  type: "SET_STATE";
};

export const initialContext = {};

const reducer = (state, action) => {
  const { type, ...stateToSave } = action;
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...stateToSave };
  }
};

const LazyContext = createContext<{
  state: any;
  dispatch: React.Dispatch<any>;
}>({ state: initialContext, dispatch: () => null });

function LazyContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialContext);
  return (
    <LazyContext.Provider value={{ state, dispatch }}>
      {children}
    </LazyContext.Provider>
  );
}

export { LazyContext, LazyContextProvider };
