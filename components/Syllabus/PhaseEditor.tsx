import { useContext } from "react";
import { SyllabusContext } from "context/SyllabusContext";


export default function PhaseEditorComponent({ phase, i }) {
    const { state, dispatch } = useContext(SyllabusContext);

    return (
        <fieldset>
            <legend>Phase {i + 1}{phase.description ? `: ${phase.description}` : ''}</legend>
            <label htmlFor="weeksPerPhase">
                Number of weeks
            </label>
            <input
                type="number"
                name="weeksPerPhase"
                min="1"
                maxLength={3}
                value={state.phases[i].numberOfWeeks}
                max={(state.weekCapacity - state.weekPhaseAllocated) + phase.numberOfWeeks}
                onChange={(e) => {
                    e.preventDefault();
                    const updatedPhaseArray = [...state.phases];
                    updatedPhaseArray[i] = {
                        ...updatedPhaseArray[i],
                        numberOfWeeks: +e.target.value
                    };

                    const weekPhaseAllocated = updatedPhaseArray.reduce((acc, n) => n.numberOfWeeks + acc, 0);

                    dispatch({
                        type: "SET_STATE",
                        phases: updatedPhaseArray,
                        weekPhaseAllocated
                    });
                }}
            />
            <br />
            <label>
                Description
                <input type="text" maxLength={50}
                    value={phase.description}
                    onChange={(e) => {
                        e.preventDefault();
                        const updatedPhaseArray = [...state.phases];
                        updatedPhaseArray[i] = {
                            ...updatedPhaseArray[i],
                            description: e.target.value
                        };
                        dispatch({
                            type: 'SET_STATE',
                            phases: updatedPhaseArray,
                        })
                    }}
                />

            </label>
        </fieldset>
    )
}