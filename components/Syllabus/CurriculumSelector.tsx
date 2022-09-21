import { useState, useEffect, useContext, useRef } from "react";
import { SyllabusContext } from "context/SyllabusContext";

export default function CurriculumSelector() {
  const { state, dispatch } = useContext(SyllabusContext);
  const [curriculumList, setCurriculumList] = useState([
    "-- Select a curriculum --",
  ]);
  const loaded = useRef(null);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      const getData = async () => {
        const data = await fetch("/api/getCurriculumList").then((d) =>
          d.json()
        );
        setCurriculumList([...curriculumList, ...data]);
      };
      getData();
    }
  }, []);
  const handleSelectUpdate = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (value !== curriculumList[0]) {
      dispatch({
        type: "SET_SELECTED_CURRICULUM",
        selectedCurriculum: value,
      });
    }
  };
  return (
    <>
      <label>
        Choose Curriculum to update
        <br />
        <select
          onChange={(e) => handleSelectUpdate(e)}
          defaultValue={curriculumList[0]}
        >
          {curriculumList.map((c, i) => (
            <option disabled={!i ? true : false} key={c}>
              {c}
            </option>
          ))}
        </select>
        <br />
        <br />
      </label>
    </>
  );
}
