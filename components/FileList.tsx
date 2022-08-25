import { ROOT_CONTENT_PATH } from "common/constants";
import { useEffect, useReducer } from "react";
import styles from "./FileList.module.css";

// https://stackoverflow.com/questions/36248245/how-to-convert-an-array-of-paths-into-json-structure
const buildJSONFromFilePathArray = ({ fileList }) => {
  const output = {};
  let current = {};
  for (const folderPath of fileList) {
    current = output;
    const folderPathArray = folderPath.split("/");
    for (const name of folderPathArray) {
      if (!(name in current)) {
        current[name] = {};
      }
      current = current[name];
    }
  }
  return output;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      const { type, ...stateToSave } = action;
      return { ...state, ...stateToSave };
  }
};

const initialState = {
  elements: "",
  testResults: [],
  fileListAsJson: {},
};

const FileList = ({ BaseFiles, handleFileListSelection }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClick = (e, filePath) => {
    e.preventDefault();
    return handleFileListSelection(ROOT_CONTENT_PATH.slice(0, -1) + filePath);
  };

  const buildFileListAccessory = (data) => {
    if (data?.error.length) {
      return (
        <p
          style={{ display: "inline" }}
          title={data.error.map((e) => e.message).join("\n")}
        >
          ❌
        </p>
      );
    }
    return "";
  };

  const jsonToElements = (json, memo = "") => {
    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    return Object.entries(json).map(([key, value]) => {
      const filePath = `${memo}/${key}`;
      if (isEmpty(value)) {
        return (
          <li key={filePath}>
            <a onClick={(e) => handleClick(e, filePath)}>{key}</a>
            {buildFileListAccessory(state.testResults[filePath])}
          </li>
        );
      }
      return (
        <li key={filePath}>
          {key}
          <ul>{jsonToElements(value, filePath)}</ul>
        </li>
      );
    });
  };

  useEffect(() => {
    if (BaseFiles.length) {
      const jsonRepresentation = buildJSONFromFilePathArray({
        fileList: BaseFiles.map((f) => f.replace(ROOT_CONTENT_PATH, "")),
      });

      dispatch({
        type: "SET_STATE",
        elements: jsonToElements(jsonRepresentation),
        fileListAsJson: jsonRepresentation,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BaseFiles, state.testResults]);

  const handleValidateFileListClick = async (e) => {
    e.preventDefault();
    const data = await fetch(
      `/api/validateMdFiles?files=${JSON.stringify(BaseFiles)}`
    ).then((r) => r.json());

    const testResults = data.testResults.reduce((acc, file) => {
      const { fileName, ...result } = file;
      // The / is needed because in jsonToElements
      // the filepath has a leading /
      const sanitizedFileName = "/" + fileName.replace(ROOT_CONTENT_PATH, "");

      return {
        ...acc,
        [sanitizedFileName]: result,
      };
    }, {});
    dispatch({
      type: "SET_STATE",
      report: `${JSON.stringify(testResults, null, 4)}`,
      testResults,
    });
  };

  return (
    <>
      <ul className={styles.list}>{state.elements}</ul>
      <button onClick={handleValidateFileListClick}>Validate File List</button>
      <pre>{state.report}</pre>
    </>
  );
};

export default FileList;
