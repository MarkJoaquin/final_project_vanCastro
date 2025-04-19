import React from "react";
import { useLessonContext } from "@/app/(context)/lessonContext";
import { formatLessonDate } from "@/lib/dateUtils";

interface ModalEventProps {
    lessonId: string | null;
    getInstructorName: (id: string) => string;
    onClose: () => void;
}

const ModalEvent: React.FC<ModalEventProps> = ({ lessonId, getInstructorName, onClose }) => {
    const { confirmedLessons } = useLessonContext();
    const lesson = confirmedLessons.find((l) => l.id === lessonId);

    if (!lesson) return null;

    return (
        <div className="fixed inset-0 bg-blur bg-opacity-30 backdrop-blur-[4px] flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Lesson Details</h2>
            <p><strong>Student:</strong> {lesson.student.name}</p>
            <p><strong>Date:</strong> {formatLessonDate(lesson.date)}</p>
            <p><strong>Start:</strong> {lesson.startTime}</p>
            <p><strong>End:</strong> {lesson.endTime}</p>
            <p><strong>Instructor:</strong> {getInstructorName(lesson.instructorId)}</p>
            <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
            Close
            </button>
        </div>
        </div>
    );
};

export default ModalEvent;