import { contentMdToNestedJSON } from 'common/commonMdParsingUtils';

const MarkdownEditor = ({ state, dispatch }) => {
  const handleTextAreaUpdate = (e) => {
    return dispatch({
      type: "SET_MD",
      payload: e.target.value,
    });
  };

  const renderMd = () => {
    const md = contentMdToNestedJSON(state.md.rawMd);
    return dispatch({
      type: "SET_STATE",
      RenderedMd: JSON.stringify(md, null, 4),
    });
  };

  const handleFileSave = async (e) => {
    e.preventDefault();
    await fetch(
      '/api/saveFile'
      , {
        method: 'POST',
        body: JSON.stringify({
          data: JSON.stringify(state.md.rawMd),
          fileName: "public" + state.md.fileName
        })
      });
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
