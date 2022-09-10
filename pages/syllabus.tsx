import { useEffect, useContext, useState, useRef } from "react";
import { getSyllabusState } from "components/Syllabus/syllabusBrowserUtils";
import { SyllabusContextProvider, SyllabusContext } from "context/SyllabusContext";
import ManageWeeksAndPhasesComponent from 'components/Syllabus/ManageWeeksAndPhases'
import SyllabusListComponent from 'components/Syllabus/SyllabusList';
import useSyllabusTotals from 'hooks/useSyllabusTotals'

const handleRender = async (e, state) => {
  e.preventDefault();
  const mdArr = [];
  let weekCounter = 1;

  // Build Phases/Weeks
  state.phases.forEach((numOfWks: number, i: number) => {
    const arrayOWeeks = Array(numOfWks).fill('');
    arrayOWeeks.forEach((_, j) => {
      if (!j) mdArr.push(
        '# Phase ' + (i + 1)
      )
      mdArr.push('## Week ' + weekCounter)
      weekCounter++;
    });
  })

  // Stick Topics in weeks
  const allocatedFiles = state.fileList.filter((file) => file.week);

  allocatedFiles.forEach((file) => {
    const sanitizedFileName = file.fileName.replace('public/content/md/', '').replace('.md', '');

    const weekIndex = mdArr.findIndex(el => el === `## Week ${file.week}`);

    mdArr.splice(weekIndex + 1, 0, `- ${sanitizedFileName}`);
  });

  const toSave = mdArr.join('\r');

  // Save to FS
  return fetch('/api/saveSyllabus', {
    method: 'POST',
    body: toSave
  })
};

// Cause of how I'm weirdly doing context
const BaseSyllabusComponent = ({ initialState }) => {
  const { state, dispatch } = useContext(SyllabusContext);
  const isLoadedRef = useRef(false);
  const { totalOfAllocatedWeeks, setInitialStateFromSyllabusAndFileList } = useSyllabusTotals();


  /** 
   * This could be done in pre-rendering
   * When I tried `getStaticProps` I got an error message complaining about the URL get. (needs to be an absolute path)
   * I'm just using the `/api/` path construct because that's how the rest of next works.
   * I didn't want to spend the time to add the localhost: whatever because my guess is that construct is going to break in prod. If there's a way to do it. I say go for it.
   * https://stackoverflow.com/questions/65981235/how-to-make-a-request-to-an-api-route-from-getstaticprops
  */
  useEffect(() => {
    const getData = async () => {
      const { syllabusText, fileList } = await getSyllabusState();
      console.log({ fileList, syllabusText })
      setInitialStateFromSyllabusAndFileList(syllabusText, fileList);
    }
    if (!isLoadedRef.current) {
      getData();
    }
    isLoadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <ManageWeeksAndPhasesComponent />
      {state.weekCapacity - totalOfAllocatedWeeks === 0 &&
        <>
          <button onClick={(e) => handleRender(e, state)}>Render</button>
          <div style={{
            display: 'flex'
          }}>
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
      }
    </div>
  );
};

export default function SyllabusPage({ initialState }) {
  return (
    <SyllabusContextProvider>
      <BaseSyllabusComponent initialState={initialState} />
    </SyllabusContextProvider>
  );
}
