import React from "react";
import { useLessonContext } from "@/app/(context)/lessonContext";
import { formatLessonDate } from "@/lib/dateUtils";
import "./ModalEvent.css";

interface ModalEventProps {
    lessonId: string | null;
    getInstructorName: (id: string) => string;
    onClose: () => void;
}

const ModalEvent: React.FC<ModalEventProps> = ({ lessonId, getInstructorName, onClose }) => {
    const { confirmedLessons } = useLessonContext();
    const lesson = confirmedLessons.find((l) => l.id === lessonId);

    if (!lesson) return null;

    
    const getInstructorColor = (instructorName: string) => {
        switch (instructorName) {
            case "Andresa":
                return "bg-[#db7b72] text-white";
            case "Anderson":
                return "bg-[#449ce7] text-white";
            default:
                return "bg-gray-300 text-black";
        }
    };

    const instructorName = getInstructorName(lesson.instructorId);
    const instructorColorClass = getInstructorColor(instructorName);

    return (
        <div className="fixed inset-0 bg-blur bg-opacity-30 backdrop-blur-[4px] flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[400px] relative overflow-hidden">
                
                <div className="bg-[#FFCE47] text-black px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Lesson Details</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-700 transition duration-200 text-xl font-bold"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                
                <div className="p-6 space-y-4 text-gray-800 text-sm">
                    
                    <div className="lesson-info-1 pb-4">
                        <p>
                            <strong>Student:</strong> {lesson.student.name}
                        </p>
                        <p>
                            <strong>Date:</strong> {formatLessonDate(lesson.date)}
                        </p>
                        <p>
                            <strong>Time:</strong> {lesson.startTime} ~ {lesson.endTime}
                        </p>
                        <p>
                            <strong>Duration:</strong> {lesson.duration} minutes
                        </p>
                        <p>
                            <strong>Instructor:</strong>{" "}
                            <span className={`font-medium rounded p-[2] px-[5] ${instructorColorClass}`}>
                                {instructorName}
                            </span>
                        </p>
                    </div>

                    
                    <div className="lesson-info-2 pb-4">
                        <p>
                            <strong>Plan:</strong> {lesson.plan}
                        </p>
                        {lesson.licenseClass && (
                            <p>
                                <strong>License Class:</strong> {lesson.licenseClass}
                            </p>
                        )}
                        <p>
                            <strong>Price:</strong> ${lesson.price}
                        </p>
                        <p>
                            <strong>Status:</strong> {lesson.status}
                        </p>
                        <p>
                            <strong>Payment Status:</strong> {lesson.paymentStatus}
                        </p>
                        {lesson.paymentMethod && (
                            <p>
                                <strong>Payment Method:</strong> {lesson.paymentMethod}
                            </p>
                        )}
                    </div>

                    
                    <div className="lesson-info-3 space-y-0">
                        
                        <p>
                            <strong>Meeting Point:</strong> {lesson.location?.name || "No location"}
                        </p>
                        <p>
                            <strong>City:</strong> {lesson.location?.city || "No city"}
                        </p>
                        <p>
                            <strong>Tracking Number:</strong> {lesson.trackingNumber}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalEvent;