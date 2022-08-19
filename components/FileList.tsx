import { ROOT_CONTENT_PATH } from "common/constants";
import { useEffect, useReducer } from "react";
import styles from "./FileList.module.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      const { type, ...stateToSave } = action;
      return { ...state, ...stateToSave };
  }
};

const initialState = {
  elements: "",
};

const FileList = ({ BaseFiles, handleFileListSelection }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const jsonToElements = (json, memo = "") => {
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }

      return Object.entries(json).map(([key, value]) => {
        if (isEmpty(value)) {
          return (
            <li key={`${memo}/${key}`}>
              <a onClick={(e) => handleClick(e, `${memo}/${key}`)}>{key}</a>
            </li>
          );
        }
        return (
          <li key={`${memo}/${key}`}>
            {key}
            <ul>{jsonToElements(value, `${memo}/${key}`)}</ul>
          </li>
        );
      });
    };
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
  }, [BaseFiles]);

  const handleClick = (e, filePath) => {
    e.preventDefault();
    return handleFileListSelection(ROOT_CONTENT_PATH.slice(0, -1) + filePath);
  };

  const handleValidateFileListClick = async (e) => {
    e.preventDefault();
    const data = await fetch(
      `/api/validateMdFiles?files=${JSON.stringify(BaseFiles)}`
    ).then((r) => r.json());
    dispatch({
      type: "SET_STATE",
      report: `${data.coverageReport}\n\n${JSON.stringify(
        data.jestReport,
        null,
        4
      )}`,
    });

    console.log({ data });
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
