import { useContext, useState, useRef, useEffect } from "react";
import { SyllabusContext } from "context/SyllabusContext";
import WeekEditor from './WeekEditor';
import useSyllabusTotals from 'hooks/useSyllabusTotals';


export default function PhaseEditorComponent({ phase, i }) {
    const { state, dispatch } = useContext(SyllabusContext);
    const { getNumberOfWeeksForPhase, totalOfAllocatedWeeks } = useSyllabusTotals();
    const numberOfWeeks = getNumberOfWeeksForPhase(i);

    const weekList = state.weeks.reduce((acc, week, index) => {
        const element = <li key={`Week-${index}`}><WeekEditor week={week} i={index} /></li>;
        return week.phaseId === i ? [...acc, element] : acc;
    }, [])

    return (
        <fieldset>
            <legend>Phase {i + 1}{phase.description ? `: ${phase.description}` : ''}</legend>
            <button onClick={(e) => {
                e.preventDefault();
                return dispatch({
                    type: 'REMOVE_PHASE',
                    phaseId: i
                })
            }}>- phase</button>
            <br />
            <label htmlFor="weeksPerPhase">
                Number of weeks: {numberOfWeeks}
            </label>
            <button onClick={(e) => {
                e.preventDefault();
                return dispatch({
                    type: 'ADD_WEEK',
                    phaseId: i
                })
            }}
                disabled={state.weekCapacity <= totalOfAllocatedWeeks}
            >+ week</button>
            <br />
            <label>
                Description
                <input type="text" maxLength={50}
                    value={phase.description}
                    onChange={(e) => {
                        e.preventDefault();
                        dispatch({
                            type: 'UPDATE_PHASES_ARRAY',
                            field: {
                                name: 'description',
                                value: e.target.value
                            },
                            index: i
                        });
                    }}
                />
            </label>
            <fieldset>
                <ul>
                    {weekList}
                </ul>
            </fieldset>
        </fieldset>
    )
}