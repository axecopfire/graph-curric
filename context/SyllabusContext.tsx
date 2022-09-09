import React, { createContext, useReducer } from "react";
import { GetRenderFileListReturnType } from 'common/commonBrowserUtils';

export type ReducerProps = {
  payload: any;
  type: "SET_STATE";
};

export const initialContext = {
  phases: [{ numberOfWeeks: 1, description: '' }],
  weekCapacity: 1,
  numberOfPhases: 1,
  weekPhaseAllocated: 1,
  fileList: []
};

export type SyllabusStateContextType = {
  phases: { numberOfWeeks: number; description: string; }[];
  weekCapacity: number;
  numberOfPhases: number;
  weekPhaseAllocated: number;
  fileList: GetRenderFileListReturnType
}

const reducer = (state, action) => {
  const { type, ...stateToSave } = action;
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...stateToSave };
  }
};

const SyllabusContext = createContext<{
  state: SyllabusStateContextType;
  dispatch: React.Dispatch<any>;
}>({ state: initialContext, dispatch: () => null });

function SyllabusContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialContext);
  return (
    <SyllabusContext.Provider value={{ state, dispatch }}>
      {children}
    </SyllabusContext.Provider>
  );
}

export { SyllabusContext, SyllabusContextProvider };
