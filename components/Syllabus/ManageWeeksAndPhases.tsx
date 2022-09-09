import { useRef, useEffect, useContext } from 'react';
import { SyllabusContext } from 'context/SyllabusContext';
import PhaseEditorComponent from './PhaseEditor';


export default function ManageWeeksAndPhasesComponent() {
    const { state, dispatch } = useContext(SyllabusContext);

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
                    min={state.phases.reduce((acc, phase) => phase.numberOfWeeks + acc, 0)}
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
                    <input
                        type="number"
                        name="phases"
                        min="1"
                        max={state.weekCapacity}
                        value={state.numberOfPhases || 1}
                        onChange={(e) => {
                            e.preventDefault();
                            const numberOfPhases = +e.target.value;
                            const phaseArray = Array(numberOfPhases).fill({ numberOfWeeks: 1, description: '' });

                            dispatch({
                                type: "SET_STATE",
                                numberOfPhases: numberOfPhases,
                                phases: phaseArray,
                                weekPhaseAllocated: phaseArray.reduce((acc, n) => n.numberOfWeeks + acc, 0)
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
