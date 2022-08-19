const MarkdownEditor = ({ state, dispatch }) => {
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

  return (
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
        {state.shouldShowRenderBaseButton && (
          <button name="render" onClick={() => renderMd()}>
            Render Base File to JSON
          </button>
        )}
      </form>
    </fieldset>
  );
};

export default MarkdownEditor;
