import { useContext } from 'react'
import { SyllabusContext } from "context/SyllabusContext";
import { reMatchHeading } from 'components/Syllabus/syllabusBrowserUtils';


export default function useSyllabusTotals() {
    const { state, dispatch } = useContext(SyllabusContext);

    const getNumberOfWeeksForPhase = (i: number) => state.weeks.filter(w => w.phaseId === i).reduce((acc) => acc + 1, 0);
    const totalOfAllocatedWeeks = state.weeks.reduce((acc) => acc + 1, 0);




    const setInitialStateFromSyllabusAndFileList = (syllabus, fileList) => {
        // https://stackoverflow.com/a/21712066
        const syllabusArr = syllabus.split(/\r?\n|\r|\n/g);
        let currentPhase = 0;
        let currentWeek = 0;
        let resultStateFileList = [...fileList];
        dispatch({
            type: 'RESET_STATE'
        })

        syllabusArr.forEach(str => {
            const heading = reMatchHeading(str);

            // Add phase related state
            if (heading === 'phase') {
                const headingNumber = str.match(/\d/);

                if (!headingNumber) {
                    throw new Error('All Phases must have numbers in format: # Phase ${number}\n Received: ' + str);
                }
                currentPhase = parseInt(headingNumber[0]);
                dispatch({
                    type: 'ADD_PHASE'
                })
            }

            // Add week related state
            else if (heading === 'week') {
                const headingMatch = str.match(/\d/);

                if (!headingMatch) {
                    throw new Error('All Weeks must have numbers in format: # Week ${number}\n Received: ' + str);
                }
                const headingNumber = parseInt(headingMatch[0]);

                currentWeek = headingNumber;
                dispatch({
                    type: 'SET_STATE',
                    weekCapacity: headingNumber
                })
                dispatch({
                    type: 'ADD_WEEK',
                    phaseId: currentPhase - 1
                })
            }
            else if (heading === 'subject') {
                const subjectFileName = str.replace('- ', 'public/content/md/') + '.md';
                const fileIndex = resultStateFileList.findIndex(file => file.fileName == subjectFileName);
                const updateFileList = [...resultStateFileList];

                if (fileIndex > -1) {
                    updateFileList[fileIndex] = {
                        ...updateFileList[fileIndex],
                        week: currentWeek
                    }
                }

                resultStateFileList = updateFileList;
            }
        });

        dispatch({
            type: 'SET_STATE',
            fileList: [...resultStateFileList]
        });
    }

    const handleSyllabusText = async (syllabusText, updateSyllabus) => {
        const mdArr = [];
        let weekCounter = 1;

        setInitialStateFromSyllabusAndFileList(syllabusText, state.fileList)

        // Build Phases/Weeks
        state.phases.forEach((phase, i: number) => {
            const arrayOWeeks = state.weeks.filter(w => w.phaseId === i);
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
        if (updateSyllabus) {
            await fetch('/api/saveSyllabus', {
                method: 'POST',
                body: toSave
            })
        }
        return toSave
    };

    return {
        getNumberOfWeeksForPhase,
        setInitialStateFromSyllabusAndFileList,
        handleSyllabusText,
        totalOfAllocatedWeeks
    }
}