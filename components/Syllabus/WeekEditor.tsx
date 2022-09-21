import { useContext, useState, useEffect, useRef } from "react";
import { SyllabusWeekType, SyllabusContext } from "context/SyllabusContext";
import useSyllabusTotals from "hooks/useSyllabusTotals";
import MarkdownEditorModal from "components/MarkdownEditorModal";

export default function WeekEditorComponent({
  week,
  i,
}: {
  week: SyllabusWeekType;
  i: number;
}) {
  const { state, dispatch } = useContext(SyllabusContext);
  const { totalOfAllocatedWeeks } = useSyllabusTotals();
  const [initialText, setInitialText] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const baseReadmeLocation = `${state.selectedCurriculum}/Week-${i + 1}.md`;
  const loaded = useRef(null);

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

  const handleDescriptionUpdate = (e) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_WEEKS_ARRAY",
      field: {
        name: "description",
        value: e.target.value,
      },
      index: i,
    });
  };
  return (
    <fieldset>
      <legend>
        Week {i + 1}
        {week.description ? `: ${week.description}` : ""}
      </legend>
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch({
            type: "REMOVE_WEEK",
            index: i,
          });
        }}
        disabled={state.weekCapacity - totalOfAllocatedWeeks < 0}
      >
        - week
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
        initialText={initialText}
        locationToSave={baseReadmeLocation}
        displayModal={displayModal}
        setDisplayModal={setDisplayModal}
      />
      <br />
      <label>
        Description
        <input
          maxLength={50}
          onChange={(e) => handleDescriptionUpdate(e)}
          value={week.description}
        />
      </label>
      <br />
      <ul>
        {state.fileList
          .filter((file) => file.week - 1 === i)
          .map((file) => (
            <li key={file.fileName}>
              {file.fileName.replace("public/content/md/", "")}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({
                    type: "DEALLOCATE_WEEK_IN_FILELIST",
                    fileName: file.fileName,
                  });
                }}
              >
                -
              </button>
            </li>
          ))}
      </ul>
    </fieldset>
  );
}
