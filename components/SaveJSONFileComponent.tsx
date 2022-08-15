import { useState, useReducer } from "react";
import styles from "./SaveJSONFileComponent.module.css";

const defaultSaveText = "Save";
/**
 * 0 - No State
 * 1 - Loading State
 * 2 - Warning State
 * 3 - Error State
 */
const initialState = {
  level: 0,
  message: "",
  submitText: defaultSaveText,
  className: "",
  confirmed: "false",
};

type ReducerActionProps = {
  level: 0 | 1 | 2 | 3;
  message: string;
  submitText?: string;
  className: string;
  type: "SET_STATE";
  confirmed?: string;
};

const reducer = (state, action: ReducerActionProps) => {
  switch (action.type) {
    case "SET_STATE":
      const { type, ...stateToSave } = action;
      const submitText = !action.submitText
        ? defaultSaveText
        : action.submitText;
      return { ...state, ...stateToSave, submitText };
  }
};

export default function SaveJSONFileComponent({ jsonFileContents }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [jsonSaveFileName, setJSONSaveFileName] = useState("");

  // Save it under `public/content/JSONs/${fileName}
  // Call Save API Endpoint
  const handleSave = async () => {
    // This variable updates in this function
    // dispatch/state is unreliable for tracking inside a function
    let updateConfirmed = state.confirmed;

    if (!jsonSaveFileName) {
      return dispatch({
        type: "SET_STATE",
        level: 3,
        message: "JSON File name must have characters",
        className: styles.error,
      });
    }

    if (updateConfirmed === "pending") {
      updateConfirmed = true;
    }

    dispatch({
      type: "SET_STATE",
      level: 2,
      message: "Loading...",
      className: styles.loading,
      submitText: "",
    });

    const response = await fetch(
      `/api/saveJSONToFile?fileName=${jsonSaveFileName}&data=${JSON.stringify(
        jsonFileContents
      )}&updateConfirmed=${updateConfirmed}`
    );

    if (response.status === 409) {
      return dispatch({
        type: "SET_STATE",
        message: "File name found, do you want to overwrite it?",
        level: 2,
        submitText: "Confirm Update",
        className: styles.warning,
        confirmed: "pending",
      });
    }

    dispatch({
      type: "SET_STATE",
      message: `File: ${jsonSaveFileName} saved successfully`,
      level: 0,
      className: "",
      confirmed: "false",
    });
  };

  return (
    <div>
      <fieldset className={state.className}>
        <legend>Save JSON file to disk</legend>
        <p>&nbsp;{state.message}</p>
        <input
          value={jsonSaveFileName}
          onChange={(e) => setJSONSaveFileName(e.target.value)}
        />
        <button onClick={() => handleSave()} disabled={!state.submitText}>
          {state.submitText}
        </button>
      </fieldset>
    </div>
  );
}
