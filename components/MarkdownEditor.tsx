const MarkdownEditor = ({ state, dispatch }) => {
  const handleTextAreaUpdate = (e) => {
    return dispatch({
      type: "SET_MD",
      payload: e.target.value,
    });
  };

  const renderMd = () => {
    const folderSplitRE = /\n-\s/;
    const initialFolderWithoutNewLineRE = /-\s/;
    const fileSplitRE = /\n\s\s-\s/;

    const md = state.md.rawMd.split(folderSplitRE).reduce((acc, phase) => {
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

  const handleFileSave = async (e) => {
    e.preventDefault();
    await fetch(
      `/api/saveFile?fileName=${
        "public" + state.md.fileName
      }&data=${JSON.stringify(state.md.rawMd)}`
    );
    console.log(state);
  };

  return (
    <fieldset
      style={{
        width: "25%",
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
        {state.shouldShowRenderBaseButton && (
          <button name="render" onClick={() => renderMd()}>
            Render Base File to JSON
          </button>
        )}
        <button onClick={handleFileSave}>Write File</button>
      </form>
    </fieldset>
  );
};

export default MarkdownEditor;
