import { useEffect, useState } from "react";

export default function MarkdownEditorModal({
  initialText,
  locationToSave,
  displayModal,
  setDisplayModal,
}) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleTextAreaUpdate = (e) => {
    e.preventDefault();
    return setText(e.target.value);
  };

  const handleFileSave = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      data: JSON.stringify(text),
      fileName: locationToSave,
      force: true,
    });
    await fetch("/api/saveFile", {
      method: "POST",
      body,
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        display: displayModal ? "flex" : "none",
        justifyContent: "center",
      }}
    >
      <fieldset
        style={{
          width: "50%",
          height: "90vh",
          overflow: "scroll",
          position: "relative",
        }}
      >
        <legend>Editing: {locationToSave}</legend>
        <button
          style={{
            right: "10px",
            position: "absolute",
          }}
          onClick={(e) => {
            e.preventDefault();
            setDisplayModal(false);
          }}
        >
          Close modal
        </button>
        <label>
          Editor
          <br />
          <textarea
            onChange={(e) => handleTextAreaUpdate(e)}
            cols={50}
            rows={30}
            value={text}
            name="mdEditor"
          />
        </label>
        <button onClick={handleFileSave}>Write File</button>
      </fieldset>
    </div>
  );
}
