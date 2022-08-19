import { ROOT_CONTENT_PATH } from "common/constants";
import { useEffect, useState } from "react";

const FileList = ({ BaseFiles }) => {
  const [state, setState] = useState<JSX.Element | JSX.Element[]>(() => (
    <li></li>
  ));
  useEffect(() => {
    const jsonToElements = (json) => {
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }

      return Object.entries(json).map(([key, value]) => {
        if (isEmpty(value)) {
          return <li key={Math.random()}>{key}</li>;
        }
        return (
          <li key={Math.random()}>
            {key}
            <ul>{jsonToElements(value)}</ul>
          </li>
        );
      });
    };
    // https://stackoverflow.com/questions/36248245/how-to-convert-an-array-of-paths-into-json-structure
    const buildJSONFromFilePathArray = ({ fileList }) => {
      console.log({ fileList });
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
        fileList: BaseFiles,
      });

      setState(jsonToElements(jsonRepresentation));
    }
  }, [BaseFiles]);

  return (
    <ul>
      {state}
      {/* {JSON.stringify(state, null, 4)} */}
      {/* <BuildFS fileList={BaseFiles} memo={{}} /> */}
    </ul>
    // <ul>
    //   {BaseFiles.map((fileName, i) => {
    //     const sanitizedFileName = fileName.replace(ROOT_CONTENT_PATH, "");
    //     // find out if is a folder
    //     return <li key={sanitizedFileName + i}>{sanitizedFileName}</li>;
    //   })}
    // </ul>
  );
};

export default FileList;
