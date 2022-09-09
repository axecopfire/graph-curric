import { useContext } from "react";
import { SyllabusContext } from "context/SyllabusContext";


export default function PhaseEditorComponent({ phase, i }) {
    const { state, dispatch } = useContext(SyllabusContext);
    const sumArray = (arr) => arr.reduce((partialSum, a) => partialSum + a, 0);

    return (
        <fieldset>
            <legend>Phase {i + 1}</legend>
            <label htmlFor="weeksPerPhase">
                Number of weeks
            </label>
            <input
                type="number"
                name="weeksPerPhase"
                min="1"
                value={phase.numberOfWeeks}
                max={(state.weekCapacity - state.weekPhaseAllocated) + phase}
                onChange={(e) => {
                    e.preventDefault();
                    const updatedPhaseArray = state.phases;
                    updatedPhaseArray[i].numberOfWeeks = +e.target.value;

                    const weekPhaseAllocated = sumArray(updatedPhaseArray);

                    dispatch({
                        type: "SET_STATE",
                        phases: updatedPhaseArray,
                        weekPhaseAllocated
                    });
                }}
            />
            <label>
                Description
                <input type="text" maxLength={50}
                    value={phase.description}
                    onChange={(e) => {
                        e.preventDefault();
                        const updatedPhaseArray = state.phases;
                        updatedPhaseArray[i].description = e.target.value;
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