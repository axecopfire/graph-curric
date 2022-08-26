import Head from "next/head";
import { useReducer, useEffect } from "react";
import BaseFilesList from "components/FileList";
import { ROOT_CONTENT_PATH } from "common/constants";
import MarkdownEditor from "components/MarkdownEditor";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STATE":
      const { type, ...stateToSave } = action;
      return { ...state, ...stateToSave };
  }
};

const MdPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    md: "",
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

      const data = await fetch("/content/Base/Base2.md").then((r) => r.text());
      dispatch({
        type: "SET_STATE",
        md: data,
      });
    };
    getData();
  }, []);

  const handleFileListSelection = async (selection) => {
    const data = await fetch(selection.replace("public", "")).then((r) =>
      r.text()
    );
    if (selection.includes(ROOT_CONTENT_PATH + "Base")) {
      return dispatch({
        type: "SET_STATE",
        md: data,
        shouldShowRenderBaseButton: true,
      });
    }

    return dispatch({
      type: "SET_STATE",
      md: data,
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
      <main>
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
    </>
  );
};

export default MdPage;
