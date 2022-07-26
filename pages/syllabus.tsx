import { useEffect, useContext, useState, useRef } from "react";
import { getSyllabusState } from "components/Syllabus/syllabusBrowserUtils";
import {
  SyllabusContextProvider,
  SyllabusContext,
} from "context/SyllabusContext";
import ManageWeeksAndPhasesComponent from "components/Syllabus/ManageWeeksAndPhases";
import SyllabusListComponent from "components/Syllabus/SyllabusList";
import useSyllabusTotals from "hooks/useSyllabusTotals";
import CurriculumSelector from "components/Syllabus/CurriculumSelector";

// Cause of how I'm weirdly doing context
const BaseSyllabusComponent = ({ initialState }) => {
  const { state, dispatch } = useContext(SyllabusContext);
  const isLoadedRef = useRef(false);
  const {
    totalOfAllocatedWeeks,
    setInitialStateFromSyllabusAndFileList,
    handleSyllabusText,
  } = useSyllabusTotals();
  const [renderedSyllabus, setRenderedSyllabus] = useState("");

  /**
   * This could be done in pre-rendering
   * When I tried `getStaticProps` I got an error message complaining about the URL get. (needs to be an absolute path)
   * I'm just using the `/api/` path construct because that's how the rest of next works.
   * I didn't want to spend the time to add the localhost: whatever because my guess is that construct is going to break in prod. If there's a way to do it. I say go for it.
   * https://stackoverflow.com/questions/65981235/how-to-make-a-request-to-an-api-route-from-getstaticprops
   */
  useEffect(() => {
    const getData = async () => {
      const root = state.selectedCurriculum.replace("public", "");

      const syllabusFilePath = `${root}/Syllabus.md`;
      const { syllabusText, fileList } = await getSyllabusState(
        syllabusFilePath
      );
      setInitialStateFromSyllabusAndFileList(syllabusText, fileList);
      setRenderedSyllabus(syllabusText);
      console.log({ state });
    };

    if (state.selectedCurriculum) {
      getData();
    }
  }, [state.selectedCurriculum]);

  return (
    <>
      <CurriculumSelector />
      {state.selectedCurriculum}
      {state.selectedCurriculum && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <ManageWeeksAndPhasesComponent />
          <div>
            <button
              onClick={async (e) => {
                e.preventDefault();
                const syllabusText = await handleSyllabusText(
                  `${state.selectedCurriculum}/Syllabus.md`,
                  false
                );
                setRenderedSyllabus(syllabusText);
              }}
            >
              Render
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSyllabusText(
                  `${state.selectedCurriculum}/Syllabus.md`,
                  true
                );
              }}
            >
              Update Syllabus
            </button>
            <br />
            <br />
            <textarea
              cols={50}
              rows={30}
              value={renderedSyllabus}
              onChange={(e) => {
                e.preventDefault();
                setRenderedSyllabus(e.target.value);
              }}
            ></textarea>
          </div>
          {state.weekCapacity - totalOfAllocatedWeeks === 0 && (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                <form>
                  Unallocated
                  <SyllabusListComponent allocated={false} />
                </form>
                <form>
                  Allocated
                  <SyllabusListComponent allocated={true} />
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default function SyllabusPage({ initialState }) {
  return (
    <SyllabusContextProvider>
      <BaseSyllabusComponent initialState={initialState} />
    </SyllabusContextProvider>
  );
}
