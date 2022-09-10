import { useRef, useEffect, useContext } from 'react';
import { SyllabusContext } from 'context/SyllabusContext';
import PhaseEditorComponent from './PhaseEditor';
import useSyllabusTotals from 'hooks/useSyllabusTotals';


export default function ManageWeeksAndPhasesComponent() {
    const { state, dispatch } = useContext(SyllabusContext);
    const {
        totalOfAllocatedWeeks
    } = useSyllabusTotals();


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
                    min={totalOfAllocatedWeeks}
                    max="51"
                    value={state.weekCapacity}
                    onChange={(e) =>
                        dispatch({
                            type: "SET_STATE",
                            weekCapacity: +e.target.value,
                        })
                    }
                />
                <fieldset>
                    <label htmlFor="phases">Number of Phases</label>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({
                                type: 'ADD_PHASE'
                            })
                        }}
                    >+ phase</button>
                    <br /><b>
                        {state.weekCapacity} - {totalOfAllocatedWeeks} = {state.weekCapacity - totalOfAllocatedWeeks || 0} </b> Weeks left to allocate to phases
                    <br />
                    <ul>
                        {state?.phases?.length &&
                            state.phases.map(
                                (phase, i) => (
                                    <li key={"Phase-" + i}>
                                        <PhaseEditorComponent phase={phase} i={i} />
                                    </li>
                                )
                            )}
                    </ul>
                </fieldset>
            </fieldset>
        </form>
    );
};
