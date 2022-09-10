import { useContext } from "react";
import { SyllabusContext } from "context/SyllabusContext";
import AllocateWeekComponent from "./AllocateWeek";

export default function SyllabusListComponent({ allocated }) {
    const { state, dispatch } = useContext(SyllabusContext);

    const handleDeAllocate = (e, lesson) => {
        e.preventDefault();
        const fileIndex = state.fileList.findIndex(
            (file) => file.fileName === lesson.fileName
        );
        const updateFileList = state.fileList;
        delete lesson.week;
        updateFileList[fileIndex] = lesson;
        dispatch({
            type: "SET_STATE",
            fileList: updateFileList,
        });
    };
    return (
        <ul>
            {state.fileList &&
                state.fileList
                    .filter(
                        (lesson) => (allocated && lesson.week > -1) || (!allocated && !lesson.week)
                    )
                    .map((lesson) => (
                        <li key={lesson.fileName}>
                            {lesson.fileName.replace("public/content/md/", "")}{" "}
                            {allocated ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            handleDeAllocate(e, lesson);
                                        }}
                                    >
                                        👈
                                    </button>
                                    &nbsp;Week: {lesson.week}
                                </>
                            ) : (
                                <>
                                    {state.weekCapacity && (
                                        <AllocateWeekComponent lesson={lesson} />
                                    )}
                                </>
                            )}
                        </li>
                    ))}
        </ul>
    );
};