import Head from "next/head";
import { useReducer, useEffect } from "react";
import BaseFilesList from "components/FileList";
import { ROOT_CONTENT_PATH } from "common/constants";
import MarkdownEditor from "components/MarkdownEditor";
import { FlowContextProvider } from "context/FlowContext";

const reducer = (state, action) => {
  const { type, ...stateToSave } = action;
  switch (action.type) {
    case "SET_STATE":
      return { ...state, ...stateToSave };
    case "SET_MD":
      return {
        ...state,
        md: {
          rawMd: action.payload,
          fileName: state.md.fileName,
        },
      };
  }
};

const MdPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    md: {
      rawMd: "",
      fileName: "",
    },
    RenderedMd: "",
    BaseFiles: [],
    shouldShowRenderBaseButton: false,
    report: "",
  });

  useEffect(() => {
    const getData = async () => {
      const getMdFileList = await fetch("/api/getMdFileList").then((r) =>
        r.json()
      );
      dispatch({
        type: "SET_STATE",
        BaseFiles: getMdFileList,
      });

      const fileName = "/content/Base/Content.md";

      const data = await fetch(fileName).then((r) => r.text());
      dispatch({
        type: "SET_STATE",
        md: {
          rawMd: data,
          fileName,
        },
      });
    };
    getData();
  }, []);

  const handleFileListSelection = async (selection) => {
    const fileName = selection.replace("public", "");
    const data = await fetch(fileName).then((r) => r.text());
    if (selection.includes(ROOT_CONTENT_PATH + "Base")) {
      return dispatch({
        type: "SET_STATE",
        md: {
          rawMd: data,
          fileName,
        },
        shouldShowRenderBaseButton: true,
      });
    }

    return dispatch({
      type: "SET_STATE",
      md: {
        rawMd: data,
        fileName,
      },
      shouldShowRenderBaseButton: false,
    });
  };

  const handleSaveFilesAndFolders = async () => {
    const data = await fetch(
      `/api/jsonToFilesFolders?json=${state.RenderedMd}`
    ).then((r) => r.json());
  };

  return (
    <>
      <Head>
        <title>Markdown Builder</title>
        <meta name="description" content="Build Markdown for graphs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FlowContextProvider>
        <main
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {state.BaseFiles && (
            <BaseFilesList
              BaseFiles={state.BaseFiles}
              handleFileListSelection={handleFileListSelection}
            />
          )}
          <MarkdownEditor state={state} dispatch={dispatch} />

          <pre>{state.RenderedMd}</pre>
          {state.shouldShowRenderBaseButton && (
            <button onClick={() => handleSaveFilesAndFolders()}>
              Save to Files and folders
            </button>
          )}
        </main>
      </FlowContextProvider>
    </>
  );
};

export default MdPage;
