import Head from "next/head";
import { useReducer, useState } from "react";

const ds = [
  {
    title: "CLI",
    id: "cli",
    description: "Heres a description",
    prereq: ["git", "computer-setup"],
  },
];

const reducer = (state, action) => {
  const lesson = state.lessons[action.lessonCounter];
  switch (action.type) {
    case "ADD_LESSON":
    case "REMOVE_LESSON":
    case "CHANGE_LESSON_TITLE":

    case "ADD_PRE_REQ":
      console.log(lesson);
      lesson.prereqList.push("");
      return {
        ...state,
        lessons: [...state.lessons],
        // prereqList: [...lesson.prereqList, ""],
      };
    case "REMOVE_PRE_REQ":
      return {
        ...state,
        // Using filter not splice because array.splice was triggering reducer twice
        prereqList: lesson.prereqList.filter(
          (_x, i) => i !== action.prereqCounter
        ),
      };
    case "CHANGE_PRE_REQ":
      lesson.prereqList[action.prereqCounter] = action.value;
      return { ...state };
  }
};

const initialState = {
  lessons: [
    {
      id: "",
      title: "",
      description: "",
      prereqList: "",
    },
  ],
};

export default function JSONBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [numberOfLessons, setNumberOfLessons] = useState(1);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.title.value);
  };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => setNumberOfLessons(numberOfLessons + 1)}>+</button>
      <button onClick={() => setNumberOfLessons(numberOfLessons - 1)}>-</button>
      <ul>
        {Array(numberOfLessons)
          .fill("")
          .map((_lesson, lessonCounter) => (
            <li key={`lesson-${lessonCounter}`}>
              <form onSubmit={handleSubmit}>
                <label>
                  Title
                  <input name="title" type="text" />
                </label>
                <label>
                  Description
                  <input name="description" type="text" />
                </label>
                <br />
                <label>
                  Pre requisite list
                  <textarea name="prereqList"></textarea>
                </label>
                <button type="submit">Submit</button>
              </form>
            </li>
          ))}
      </ul>
    </div>
  );
}
