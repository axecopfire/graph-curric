import Head from "next/head";
import { useReducer, useState } from "react";
import styles from "../styles/Json.module.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_LESSON":
      return { ...state, lessons: [...state.lessons, action.lesson] };
    case "UPDATE_TEXTAREA":
      return action.value;
  }
};

const initialState = {
  lessons: [],
};

export default function JSONBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [numberOfLessons, setNumberOfLessons] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_LESSON",
      lesson: {
        id: e.target.id.value,
        title: e.target.title.value,
        description: e.target.description.value,
        prereqList: e.target.prereqList.value,
      },
    });
  };

  const handleTextAreaChange = (e) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_TEXTAREA",
      value: JSON.parse(e.target.value),
    });
  };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Build JSON for graphs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>JSON Workspace</h1>
        <button onClick={() => setNumberOfLessons(numberOfLessons + 1)}>
          +
        </button>
        <button onClick={() => setNumberOfLessons(numberOfLessons - 1)}>
          -
        </button>
        <ul>
          {Array(numberOfLessons)
            .fill("")
            .map((_lesson, lessonCounter) => (
              <li key={`lesson-${lessonCounter}`}>
                <fieldset>
                  <legend>A lesson</legend>
                  <form onSubmit={handleSubmit}>
                    <label>
                      Id
                      <input type="text" name="id" />
                    </label>
                    <label>
                      Title
                      <input name="title" type="text" />
                    </label>
                    <label>
                      Description
                      <input name="description" type="text" />
                    </label>
                    <label>
                      Pre requisite list (comma delimited)
                      <textarea name="prereqList"></textarea>
                    </label>
                    <button type="submit">Append</button>
                  </form>
                </fieldset>
              </li>
            ))}
        </ul>
        <textarea
          onChange={handleTextAreaChange}
          value={JSON.stringify(state, null, 4)}
        ></textarea>
      </main>
    </div>
  );
}
