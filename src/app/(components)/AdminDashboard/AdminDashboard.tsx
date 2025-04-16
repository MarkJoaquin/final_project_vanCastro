"use client";

import InstructorCard from "./InstructorCard/InstructorCard";
import AdminTemplate from "./Template/AdminTemplate";
import LessonRequests from "./LessonRequest/LessonRequest";
import LessonList from "./LessonList/LessonList";
import StudentList from "./StudentList/StudentList";

export default function Dashboard() {
  return (
    <div className="min-h-[70vh]">
      
      <InstructorCard />
      <LessonRequests />
      <LessonList />
      <StudentList />
      
      
      
    </div>
  );
}
