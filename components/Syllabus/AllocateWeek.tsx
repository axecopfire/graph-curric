import { useState, useContext } from "react";
import { SyllabusContext } from "context/SyllabusContext";

export default function AllocateWeekComponent({ lesson }) {
    const { state, dispatch } = useContext(SyllabusContext);
    const [buttonState, setButtonState] = useState("off");
    const [weekChoice, setWeekChoice] = useState(1);

    const saveWeekChoice = (e) => {
        e.preventDefault();
        const fileIndex = state.fileList.findIndex(
            (el) => el.fileName === lesson.fileName
        );
        const updateFileList = state.fileList;
        updateFileList[fileIndex] = {
            ...state.fileList[fileIndex],
            week: weekChoice,
        };
        dispatch({
            type: "SET_STATE",
            fileList: updateFileList,
        });
    };

    switch (buttonState) {
        case "off":
            return (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setButtonState("addWeek");
                    }}
                >
                    ✏️
                </button>
            );
        case "addWeek":
            if (!state.weekCapacity) {
                return <p>👆 The class is like no weeks long</p>;
            }
            return (
                <>
                    <select
                        onChange={(e) => {
                            setWeekChoice(Number(e.target.value));
                        }}
                    >
                        {Array.from(Array(Number(state.weekCapacity)).keys()).map(
                            (week, i) => (
                                <option value={week + 1} key={`week-${week + 1}-${i + 1}`}>
                                    {week + 1}
                                </option>
                            )
                        )}
                    </select>
                    <button onClick={saveWeekChoice}>✔️</button>
                </>
            );
    }
};
