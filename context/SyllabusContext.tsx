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
  fileList: [],
  selectedCurriculum: ''
};

export type SyllabusWeekType = { description: string; phaseId: number; }

export type SyllabusStateContextType = {
  phases: { description: string; }[];
  weeks: SyllabusWeekType[]
  weekCapacity: number;
  fileList: GetRenderFileListReturnType,
  selectedCurriculum: string;
}

type FieldType = {
  name: 'description' | 'phaseId' | 'week';
  value: string | number;
};

type UpdateArrayItemFieldType = {
  state: SyllabusStateContextType;
  arrayName: 'phases' | 'weeks' | 'fileList';
  field: FieldType;
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


const getArrayName = (skipActions, type) => {
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

type ActionType = {
  type: 'SET_STATE' | 'RESET_STATE' | 'ADD_PHASE' | 'ADD_WEEK' | 'REMOVE_WEEK' | 'REMOVE_PHASE' | 'UPDATE_PHASES_ARRAY' | 'UPDATE_WEEKS_ARRAY' | 'DEALLOCATE_WEEK_IN_FILELIST' | 'SET_SELECTED_CURRICULUM';
  description?: string;
  phaseId?: number;
  index?: number;
  field?: FieldType;
  fileName?: string;
  selectedCurriculum?: string;
  weekCapacity?: number;
  fileList?: GetRenderFileListReturnType;
}

const reducer = (state: SyllabusStateContextType, action: ActionType): SyllabusStateContextType => {
  const { type, ...stateToSave } = action;
  // NOTE: When adding a new action that's not an array
  // Register it in skipAction
  const skipActions = [
    'SET_STATE',
    'RESET_STATE',
    'SET_SELECTED_CURRICULUM'
  ]
  // NOTE: When adding a new array, register it with arrayName
  const arrayName = getArrayName(skipActions, action.type);

  // NOTE: When registering new action check to make sure it needs to get added to a RESET_STATE override

  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...stateToSave };
    case 'RESET_STATE':
      return { ...initialContext, selectedCurriculum: state.selectedCurriculum }
    case 'ADD_PHASE': {
      const tmpArr = [...state.phases, { description: action.description ? action.description : '' }];
      return {
        ...state,
        phases: [...tmpArr],
      }
    }
    case 'ADD_WEEK':
      return {
        ...state,
        weeks: [...state.weeks, {
          phaseId: action.phaseId,
          description: action.description ? action.description : ''
        }].sort((a, b) => a.phaseId > b.phaseId ? 1 : -1),
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
    case 'DEALLOCATE_WEEK_IN_FILELIST': {
      const fileIndex = state.fileList.findIndex(
        (file) => file.fileName === action.fileName
      );
      const updateFileList = [...state.fileList];
      delete updateFileList[fileIndex].week;
      return {
        ...state,
        fileList: updateFileList
      }
    }
    case 'SET_SELECTED_CURRICULUM':
      return {
        ...state,
        selectedCurriculum: action.selectedCurriculum
      }
    default:
      return state;
  }
};

const SyllabusContext = createContext<{
  state: SyllabusStateContextType;
  dispatch: React.Dispatch<ActionType>;
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
