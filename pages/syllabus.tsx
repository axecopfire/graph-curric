import { useEffect, useContext, useState, useRef } from "react";
import { getRenderFileList } from "common/commonBrowserUtils";
import { LazyContextProvider, LazyContext } from "context/LazyContext";

const ManageWeeksAndPhasesComponent = () => {
  const { state, dispatch } = useContext(LazyContext);
  const sumArray = (arr) => arr.reduce((partialSum, a) => partialSum + a, 0);
  const isLoadedRef = useRef(false)

  useEffect(() => {
    if(!isLoadedRef.current) {
      dispatch({
        type: 'SET_STATE',
        phases: [1],
        weekCapacity: 1,
        numberOfPhases: 1,
        weekPhaseAllocated: 1
      })
    }
    isLoadedRef.current = true;
  }, []);

  return (
    <form>
      <fieldset>
        <legend>Manage weeks and phases</legend>
        <br />
        {!state.weekCapacity && (
          <>
            <b>How long do you want the course to take?</b>
            <br />
          </>
        )}
        <label htmlFor="weeks">Number of Weeks for the course</label>
        <input
          type="number"
          name="weeks"
          min={state.phases}
          max="51"
          value={state.weekCapacity || 1}
          onChange={(e) =>
            dispatch({
              type: "SET_STATE",
              weekCapacity: +e.target.value,
            })
          }
        />
        <fieldset>
          <label htmlFor="phases">Number of Phases</label>
          <input
            type="number"
            name="phases"
            min="1"
            max={state.weekCapacity}
            value={state.numberOfPhases || 1}
            onChange={(e) => {
              e.preventDefault();
              const numberOfPhases = +e.target.value;
              const phaseArray = Array(numberOfPhases).fill(1);

              dispatch({
                type: "SET_STATE",
                numberOfPhases: numberOfPhases,
                phases: phaseArray,
                weekPhaseAllocated: sumArray(phaseArray)
              });
            }}
          />
          <br /><b>
          {state.weekCapacity} - {state.weekPhaseAllocated} = {state.weekCapacity - state.weekPhaseAllocated || 0} </b> Weeks left to allocate to phases
          <br />
          <ul>
            {state?.phases?.length &&
              state.phases.map(
                (phase, i) => (
                  <li key={"Phase-" + i}>
                    <label htmlFor="weeksPerPhase">
                      Number of weeks for phase {i + 1}
                    </label>
                    <input
                      type="number"
                      name="weeksPerPhase"
                      min="1"
                      value={phase}
                      max={(state.weekCapacity - state.weekPhaseAllocated) + phase}
                      onChange={(e) => {
                        e.preventDefault();
                        const updatedPhaseArray = state.phases;
                        updatedPhaseArray[i] = +e.target.value;

                        const weekPhaseAllocated = sumArray(updatedPhaseArray);

                        dispatch({
                          type: "SET_STATE",
                          phases: updatedPhaseArray,
                          weekPhaseAllocated
                        });
                      }}
                    />
                  </li>
                )
              )}
          </ul>
        </fieldset>
      </fieldset>
    </form>
  );
};

const AllocateWeekComponent = ({ lesson }) => {
  const { state, dispatch } = useContext(LazyContext);
  const [buttonState, setButtonState] = useState("off");
  const [weekChoice, setWeekChoice] = useState(1);

  const saveWeekChoice = (e) => {
    e.preventDefault();
    const fileIndex = state.fileList.findIndex(
      (el) => el.fileName === lesson.fileName
    );
    const updateFileList = state.fileList;
    updateFileList[fileIndex] = {
      ...state.fileList[fileIndex],
      week: weekChoice,
    };
    dispatch({
      type: "SET_STATE",
      fileList: updateFileList,
    });
  };

  switch (buttonState) {
    case "off":
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            setButtonState("addWeek");
          }}
        >
          ✏️
        </button>
      );
    case "addWeek":
      if (!state.weekCapacity) {
        return <p>👆 The class is like no weeks long</p>;
      }
      return (
        <>
          <select
            onChange={(e) => {
              setWeekChoice(Number(e.target.value));
            }}
          >
            {Array.from(Array(Number(state.weekCapacity)).keys()).map(
              (week, i) => (
                <option value={week + 1} key={`week-${week + 1}-${i + 1}`}>
                  {week + 1}
                </option>
              )
            )}
          </select>
          <button onClick={saveWeekChoice}>✔️</button>
        </>
      );
  }
};

const SyllabusListComponent = ({ allocated }) => {
  const { state, dispatch } = useContext(LazyContext);

  const handleDeAllocate = (e, lesson) => {
    e.preventDefault();
    const fileIndex = state.fileList.findIndex(
      (file) => file.fileName === lesson.fileName
    );
    const updateFileList = state.fileList;
    delete lesson.week;
    updateFileList[fileIndex] = lesson;
    dispatch({
      type: "SET_STATE",
      fileList: updateFileList,
    });
  };
  return (
    <ul>
      {state.fileList &&
        state.fileList
          .filter(
            (lesson) =>
              (allocated && lesson.week) || (!allocated && !lesson.week)
          )
          .map((lesson) => (
            <li key={lesson.fileName}>
              {lesson.fileName.replace("public/content/md/", "")}{" "}
              {allocated ? (
                <button
                  onClick={(e) => {
                    handleDeAllocate(e, lesson);
                  }}
                >
                  👈
                </button>
              ) : (
                <>
                  {state.weekCapacity && (
                    <AllocateWeekComponent lesson={lesson} />
                  )}
                </>
              )}
            </li>
          ))}
    </ul>
  );
};

// Cause of how I'm weirdly doing context
const BaseSyllabusComponent = () => {
  const { state, dispatch } = useContext(LazyContext);

  const handleRender = (e) => {
    e.preventDefault();
    console.log({ state });
  };

  useEffect(() => {
    const getData = async () => {
      const fileList = await getRenderFileList();
      dispatch({
        type: "SET_STATE",
        fileList,
      });
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ManageWeeksAndPhasesComponent />
      <button onClick={handleRender}>Render</button>
      <form>
        Unallocated
        <SyllabusListComponent allocated={false} />
      </form>
      <form>
        Allocated
        <SyllabusListComponent allocated={true} />
      </form>
    </>
  );
};

export default function SyllabusPage() {
  return (
    <LazyContextProvider>
      <BaseSyllabusComponent />
    </LazyContextProvider>
  );
}
