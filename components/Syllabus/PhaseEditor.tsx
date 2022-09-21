import { useContext, useState, useRef, useEffect } from "react";
import { SyllabusContext } from "context/SyllabusContext";
import WeekEditor from "./WeekEditor";
import useSyllabusTotals from "hooks/useSyllabusTotals";
import MarkdownEditorModal from "components/MarkdownEditorModal";

export default function PhaseEditorComponent({ phase, i }) {
  const { state, dispatch } = useContext(SyllabusContext);
  const { getNumberOfWeeksForPhase, totalOfAllocatedWeeks } =
    useSyllabusTotals();
  const numberOfWeeks = getNumberOfWeeksForPhase(i);
  const [initialText, setInitialText] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const baseReadmeLocation = `${state.selectedCurriculum}/Phase-${i + 1}.md`;
  const loaded = useRef(null);

  const weekList = state.weeks.reduce((acc, week, index) => {
    const element = (
      <li key={`Week-${index}`}>
        <WeekEditor week={week} i={index} />
      </li>
    );
    return week.phaseId === i ? [...acc, element] : acc;
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(baseReadmeLocation.replace("public", "")).then(
        (r) => (r.status === 200 ? r.text() : "")
      );
      setInitialText(data);
    };
    if (!loaded.current) {
      loaded.current = true;
      getData();
    }
  }, []);

  return (
    <fieldset>
      <legend>
        Phase {i + 1}
        {phase.description ? `: ${phase.description}` : ""}
      </legend>
      <button
        onClick={(e) => {
          e.preventDefault();
          return dispatch({
            type: "REMOVE_PHASE",
            phaseId: i,
          });
        }}
      >
        - phase
      </button>
      <br />
      <button
        onClick={(e) => {
          e.preventDefault();
          setDisplayModal(true);
        }}
      >
        Edit Base README
      </button>
      <MarkdownEditorModal
        displayModal={displayModal}
        setDisplayModal={setDisplayModal}
        initialText={initialText}
        locationToSave={baseReadmeLocation}
      />
      <br />
      <label htmlFor="weeksPerPhase">Number of weeks: {numberOfWeeks}</label>
      <button
        onClick={(e) => {
          e.preventDefault();
          return dispatch({
            type: "ADD_WEEK",
            phaseId: i,
          });
        }}
        disabled={state.weekCapacity <= totalOfAllocatedWeeks}
      >
        + week
      </button>
      <br />
      <label>
        Description
        <input
          type="text"
          maxLength={50}
          value={phase.description}
          onChange={(e) => {
            e.preventDefault();
            dispatch({
              type: "UPDATE_PHASES_ARRAY",
              field: {
                name: "description",
                value: e.target.value,
              },
              index: i,
            });
          }}
        />
      </label>
      <fieldset>
        <ul>{weekList}</ul>
      </fieldset>
    </fieldset>
  );
}
