import { renderRawMd } from "common/commonBrowserUtils";
import Head from "next/head";
import { useReducer, useEffect } from "react";
import { ROOT_CONTENT_PATH } from "common/constants";

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
  });

  // a form with some fields (metadata, text)
  // Create an API endpoint that given a filename will run through it and return the parsed out sections?
  // List of Markdown files
  // Further feature Md Render preview maybe?

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

  const handleTextAreaUpdate = (e) => {
    return dispatch({
      type: "SET_STATE",
      md: e.target.value,
    });
  };

  const renderMd = () => {
    const folderSplitRE = /\n-\s/;
    const initialFolderWithoutNewLineRE = /-\s/;
    const fileSplitRE = /\n\s\s-\s/;

    const md = state.md.split(folderSplitRE).reduce((acc, phase) => {
      // Trims remove the \r all over the place
      const fileList = phase.split(fileSplitRE).map((f) => f.trim());
      const folderName = fileList
        .shift()
        .replace(initialFolderWithoutNewLineRE, "");

      /**
       * An object that looks like
       * ```{
       *  [title]: ${content string}
       * }```
       */
      const fileObject = fileList.reduce((acc, file) => {
        // content looks like <title>\r\n-<content>
        const contentTitle = /.*/;
        const hasContentRE = /\n.*/;
        const title = file.match(contentTitle)[0];
        const hasContent = file.match(hasContentRE);
        const removeTitle = file.replace(contentTitle, "").trim();

        return {
          ...acc,
          [title]: hasContent ? removeTitle : "",
        };
      }, {});

      return { ...acc, [folderName]: fileObject };
    }, {});

    return dispatch({
      type: "SET_STATE",
      RenderedMd: JSON.stringify(md, null, 4),
    });
  };

  const handleSaveFilesAndFolders = async () => {
    const data = await fetch(
      `/api/jsonToFilesFolders?json=${state.RenderedMd}`
    ).then((r) => r.json());
    console.log({ data });
  };

  return (
    <>
      <Head>
        <title>Markdown Builder</title>
        <meta name="description" content="Build Markdown for graphs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ul>
          {state.BaseFiles &&
            state.BaseFiles.map((fileName, i) => {
              const sanitizedFileName = fileName.replace(ROOT_CONTENT_PATH, "");
              return <li key={sanitizedFileName + i}>{sanitizedFileName}</li>;
            })}
        </ul>
        <fieldset>
          <legend>Markdown builder</legend>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Editor
              <br />
              <textarea
                onChange={(e) => handleTextAreaUpdate(e)}
                cols={50}
                rows={30}
                value={state.md}
                name="mdEditor"
              />
            </label>
            <button name="render" onClick={() => renderMd()}>
              Render
            </button>
          </form>
        </fieldset>
        <pre>{state.RenderedMd}</pre>
        <button onClick={() => handleSaveFilesAndFolders()}>
          Save to Files and folders
        </button>
      </main>
    </>
  );
};

export default MdPage;
