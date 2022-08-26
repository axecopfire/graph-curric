import { ROOT_CONTENT_PATH } from "common/constants";
import { useEffect, useReducer } from "react";
import styles from "./FileList.module.css";
import { renderedFileListToFlow, renderRawMd } from "common/commonBrowserUtils";
import FileListFlow from "./FileListFlow";

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

  const handleCreateReadmeClick = async (e) => {
    e.preventDefault();
    const report = await fetch(
      `/api/createReadme?curriculum=${JSON.stringify(state.fileListAsJson)}`
    ).then((r) => r.json());

    dispatch({
      type: "SET_STATE",
      report: JSON.stringify(report, null, 4),
    });
  };

  const buildFileListAccessory = (data) => {
    if (Array.isArray(data?.error) && !data?.error.length) {
      return <span>✔️</span>;
    }
    if (data?.error.length) {
      return (
        <span title={data.error.map((e) => e.message).join("\n")}>❌</span>
      );
    }
    return "";
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
    dispatch({
      type: "SET_STATE",
      fileListAsJson: output,
    });
    return output;
  };

  const buildJSONFromRenderedFilePathArray = (fileList) => {
    const output = {};
    let current = {};
    for (const fileObj of fileList) {
      current = output;
      const folderPathArray = fileObj.fileName.split("/");
      for (let i = 0; i < folderPathArray.length; i++) {
        const name = folderPathArray[i];
        if (!(name in current)) {
          if (i === folderPathArray.length - 1) {
            current[name] = fileObj;
          } else {
            current[name] = {};
          }
        }
        current = current[name];
      }
    }
    dispatch({
      type: "SET_STATE",
      fileListAsJson: output,
    });
    return output;
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
            <a onClick={(e) => handleClick(e, filePath)}>
              {key} {buildFileListAccessory(state.testResults[filePath])}
            </a>
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

  const handleRenderClick = async () => {
    const fileListToRender = BaseFiles.filter((filePath) =>
      filePath.includes("content/md/")
    );
    const staticMd = await fetch(
      `/api/getStaticMd?fileList=${JSON.stringify(fileListToRender)}`
    ).then((r) => r.json());
    const renderedMd = renderRawMd(staticMd);

    // const jsonRepresentation = buildJSONFromRenderedFilePathArray(
    //   renderedMd.map((file) => ({
    //     ...file,
    //     fileName: file.fileName.replace("public/content/md/", ""),
    //   }))
    // );

    const data = await renderedFileListToFlow(renderedMd);
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
      <FileListFlow />
      <ul className={styles.list}>{state.elements}</ul>
      <button onClick={handleValidateFileListClick}>Validate File List</button>
      <button onClick={handleCreateReadmeClick}>Create Readme</button>
      <button onClick={handleRenderClick}>Render</button>
      <pre>{state.report}</pre>
    </>
  );
};

export default FileList;
