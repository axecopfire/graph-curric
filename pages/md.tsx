import { renderRawMd } from "common/commonBrowserUtils";
import Head from "next/head";
import { useReducer, useEffect } from "react";

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
  });

  // a form with some fields (metadata, text)
  // Create an API endpoint that given a filename will run through it and return the parsed out sections?
  // List of Markdown files
  // Further feature Md Render preview maybe?

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("/content/md/Base.md").then((r) => r.text());
      dispatch({
        type: "SET_STATE",
        md: data,
      });
    };
    getData();
  }, [state.md]);

  const handleTextAreaUpdate = (e) => {
    return dispatch({
      type: "SET_STATE",
      md: e.target.value,
    });
  };

  const renderMd = () => {
    const md = state.md.split(/##\s/).map((phase) => phase.split(/###\s/));
    console.log({ md, st: state.md });

    return dispatch({
      type: "SET_STATE",
      RenderedMd: "yo",
    });
  };

  return (
    <>
      <Head>
        <title>Markdown Builder</title>
        <meta name="description" content="Build Markdown for graphs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
            <button name="save" type="submit">
              Save
            </button>
          </form>
        </fieldset>
        <div>{state.RenderedMd}</div>
      </main>
    </>
  );
};

export default MdPage;
