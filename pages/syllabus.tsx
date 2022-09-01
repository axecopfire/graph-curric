import { useEffect, useContext, useState } from "react";
import { getRenderFileList } from "common/commonBrowserUtils";
import { LazyContextProvider, LazyContext } from "context/LazyContext";

const ManageWeeksAndPhasesComponent = () => {
  const { state, dispatch } = useContext(LazyContext);

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
          min="1"
          max="51"
          value={state.weekCapacity || 1}
          onChange={(e) =>
            dispatch({
              type: "SET_STATE",
              weekCapacity: e.target.value,
            })
          }
        />
        <fieldset>
          <label htmlFor="phases">Number of Phases</label>
          <input
            type="number"
            name="phases"
            min="1"
            max={state.weekCapacity || 0}
            onChange={(e) => {
              e.preventDefault();
              dispatch({
                type: "SET_STATE",
                numberOfPhases: e.target.value,
              });
              dispatch({
                type: "SET_STATE",
                phases: Array.from(Array(Number(state.numberOfPhases)).keys()),
              });
            }}
          />
          {state.weekPhaseAllocation} Weeks left to allocate to phases
          <ul>
            {state.numberOfPhases &&
              Array.from(Array(Number(state.numberOfPhases)).keys()).map(
                (phase, i) => (
                  <li key={"Phase-" + i}>
                    <label htmlFor="weeksPerPhase">
                      Number of weeks for phase {phase + 1}
                    </label>
                    <input
                      type="number"
                      name="weeksPerPhase"
                      min="1"
                      max="10"
                      onChange={(e) => {
                        e.preventDefault();
                        console.log(phase);
                        // dispatch({
                        //   type: "SET_STATE",
                        //   numberOfPhases: e.target.value,
                        // });
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

  const handleAllocate = (e, fileName, week) => {
    e.preventDefault();
    console.log({ fileName, week });
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
