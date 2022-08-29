import React, { createContext, useReducer } from "react";
import { Node, Edge } from "react-flow-renderer";

export type FlowReducerActionProps = {
  payload: any;
  type: "SET_NODES" | "SET_EDGES";
};

type FlowContextProps = {
  nodes: Node[];
  edges: Edge[];
};

export const initialContext = { nodes: [], edges: [] };

const FlowReducer = (
  state: FlowContextProps,
  action: FlowReducerActionProps
) => {
  switch (action.type) {
    case "SET_NODES":
      return { ...state, nodes: [...action.payload] };
    case "SET_EDGES":
      return { ...state, edges: [...action.payload] };
  }
};

const FlowContext = createContext<{
  state: FlowContextProps;
  dispatch: React.Dispatch<any>;
}>({ state: initialContext, dispatch: () => null });

function FlowContextProvider({ children }) {
  const [state, dispatch] = useReducer(FlowReducer, initialContext);
  return (
    <FlowContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowContext.Provider>
  );
}

export { FlowContext, FlowContextProvider };
