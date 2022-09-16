import { useContext } from 'react';
import { SyllabusWeekType, SyllabusContext } from 'context/SyllabusContext';
import useSyllabusTotals from 'hooks/useSyllabusTotals';

export default function WeekEditorComponent({ week, i }: { week: SyllabusWeekType; i: number; }) {
    const { state, dispatch } = useContext(SyllabusContext);
    const { totalOfAllocatedWeeks } = useSyllabusTotals();

    const handleDescriptionUpdate = (e) => {
        e.preventDefault();
        dispatch({
            type: 'UPDATE_WEEKS_ARRAY',
            field: {
                name: 'description',
                value: e.target.value
            },
            index: i
        });
    }
    return <fieldset>
        <legend>Week {i + 1}{week.description ? `: ${week.description}` : ''}</legend>
        <label>
            Description
            <input
                maxLength={50}
                onChange={e => handleDescriptionUpdate(e)}
                value={week.description}
            />
        </label>
        <button onClick={(e) => {
            e.preventDefault();
            dispatch({
                type: 'REMOVE_WEEK',
                index: i
            })

        }}
            disabled={state.weekCapacity - totalOfAllocatedWeeks < 0}
        >- week</button>
        <ul>
            {state.fileList.filter(file => file.week - 1 === i).map((file) => <li key={file.fileName}>{file.fileName.replace("public/content/md/", "")}<button onClick={(e) => {
                e.preventDefault()
                dispatch({
                    type: 'DEALLOCATE_WEEK_IN_FILELIST',
                    fileName: file.fileName
                })
            }}>-</button></li>)}
        </ul>
    </fieldset>
}