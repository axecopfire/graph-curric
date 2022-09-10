import React, { createContext, useReducer } from "react";
import { GetRenderFileListReturnType } from 'common/commonBrowserUtils';

export type ReducerProps = {
  payload: any;
  type: "SET_STATE";
};

export const initialContext = {
  phases: [],
  weeks: [],
  weekCapacity: 1,
  fileList: []
};

export type SyllabusWeekType = { description: string; phaseId: number; }

export type SyllabusStateContextType = {
  phases: { description: string; }[];
  weeks: SyllabusWeekType[]
  weekCapacity: number;
  fileList: GetRenderFileListReturnType
}


type UpdateArrayItemFieldType = {
  state: SyllabusStateContextType;
  arrayName: 'phases' | 'weeks';
  field: {
    name: 'description' | 'phaseId';
    value: string | number;
  };
  index: number;
}
const updateArrayItemField = ({ state, arrayName, field, index }: UpdateArrayItemFieldType) => {
  const arrayToUpdate = [...state[arrayName]];
  arrayToUpdate[index] = {
    ...arrayToUpdate[index],
    [field.name]: field.value
  }
  return arrayToUpdate;
}


const getArrayName = (type) => {
  const skipActions = [
    'SET_STATE',
    'RESET_STATE'
  ]
  if (skipActions.includes(type)) return;
  if (type.includes('PHASE')) return 'phases';
  if (type.includes('WEEK')) return 'weeks';
  throw new Error('SyllabusContext has an unrecognized action type: ' + type);
}

const removePhase = (index, state) => {
  let tmpWeekArr = [...state.weeks];
  let tmpPhaseArr = [...state.phases];
  tmpWeekArr = tmpWeekArr.filter(w => w.phaseId !== index);
  tmpPhaseArr.splice(index, 1);

  return {
    weeks: tmpWeekArr,
    phases: tmpPhaseArr
  }
}

const reducer = (state, action): SyllabusStateContextType => {
  const { type, ...stateToSave } = action;
  const arrayName = getArrayName(action.type);

  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...stateToSave };
    case 'RESET_STATE':
      return initialContext
    case 'ADD_PHASE': {
      const tmpArr = [...state.phases, { description: '' }];
      return {
        ...state,
        phases: [...tmpArr],
      }
    }
    case 'ADD_WEEK':
      return {
        ...state,
        weeks: [...state.weeks, { phaseId: action.phaseId, description: '' }].sort((a, b) => a.phaseId > b.phaseId ? 1 : -1),
      }
    case 'REMOVE_WEEK': {
      const tmpArr = [...state.weeks]
      tmpArr.splice(action.index, 1);
      return {
        ...state,
        weeks: tmpArr,
      }
    }
    case 'REMOVE_PHASE': {
      const { weeks, phases } = removePhase(action.index, state);
      return {
        ...state,
        weeks,
        phases
      }
    }
    case 'UPDATE_PHASES_ARRAY':
    case 'UPDATE_WEEKS_ARRAY':
      return {
        ...state,
        [arrayName]: updateArrayItemField({
          state,
          arrayName,
          field: action.field,
          index: action.index
        })
      }
    default:
      return state;
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
