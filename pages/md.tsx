import Head from "next/head";
import { useReducer, useEffect } from "react";
import FileList from "components/FileList";
import { ROOT_CONTENT_PATH } from "common/constants";
import { FlowContextProvider } from "context/FlowContext";
import { contentMdToNestedJSON } from "common/commonMdParsingUtils";

const MarkdownEditor = ({ state, dispatch }) => {
  const handleTextAreaUpdate = (e) => {
    return dispatch({
      type: "SET_MD",
      payload: e.target.value,
    });
  };

  const handleFileSave = async (e) => {
    e.preventDefault();
    await fetch("/api/saveFile", {
      method: "POST",
      body: JSON.stringify({
        data: JSON.stringify(state.md.rawMd),
        fileName: "public" + state.md.fileName,
      }),
    });
  };

  return (
    <fieldset
      style={{
        width: "25%",
        position: "fixed",
        right: "0",
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <legend>Markdown builder</legend>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Editor
          <br />
          <textarea
            onChange={(e) => handleTextAreaUpdate(e)}
            cols={50}
            rows={30}
            value={state.md.rawMd}
            name="mdEditor"
          />
        </label>
        <button onClick={handleFileSave}>Write File</button>
      </form>
    </fieldset>
  );
};

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
    const data = await fetch(`/api/jsonToFilesFolders`, {
      method: "POST",
      body: JSON.stringify({
        // This can break really easily if not given the Content.md file
        json: contentMdToNestedJSON(state.md.rawMd),
      }),
    }).then((r) => r.json());
  };

  const renderMd = () => {
    const md = contentMdToNestedJSON(state.md.rawMd);
    return dispatch({
      type: "SET_STATE",
      RenderedMd: JSON.stringify(md, null, 4),
    });
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
            <FileList
              BaseFiles={state.BaseFiles}
              handleFileListSelection={handleFileListSelection}
            />
          )}
          {/* {state.shouldShowRenderBaseButton && (
            <button name="render" onClick={() => renderMd()}>
              Render Base File to JSON
            </button>
          )} */}
          <MarkdownEditor state={state} dispatch={dispatch} />

          {/* <pre>{state.RenderedMd}</pre> */}
          {/* ACTION LIST */}
          <div>
            {state.shouldShowRenderBaseButton && (
              <button onClick={() => handleSaveFilesAndFolders()}>
                Save to Files and folders
              </button>
            )}
          </div>
        </main>
      </FlowContextProvider>
    </>
  );
};

export default MdPage;
