import { useState } from "react";
import styles from "./SaveJSONFileComponent.module.css";

export default function SaveJSONFileComponent({ jsonFileContents }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [jsonSaveFileName, setJSONSaveFileName] = useState("");

  const handleSave = async () => {
    // What do you want to name the file?
    // Save it under `public/content/JSONs/${fileName}
    // Call Save API Endpoint

    if (!jsonSaveFileName) {
      setErrorMessage("JSON File name must have characters");
      return;
    }

    const response = await fetch(
      `/api/saveJSONToFile?fileName=${jsonSaveFileName}&data=${JSON.stringify(
        jsonFileContents
      )}`
    );

    setErrorMessage("");
    setIsLoading("Saving...");
  };

  return (
    <div>
      <fieldset className={errorMessage && styles.error}>
        <legend>Save JSON file to disk</legend>
        <p>&nbsp;{errorMessage || isLoading}</p>
        <input
          value={jsonSaveFileName}
          onChange={(e) => setJSONSaveFileName(e.target.value)}
        />
        <button onClick={() => handleSave()}>Save</button>
      </fieldset>
    </div>
  );
}
