"use client";

import InstructorCard from "./InstructorCard/InstructorCard";
import AdminTemplate from "./Template/AdminTemplate";
import LessonRequests from "./LessonRequest/LessonRequest";
import LessonList from "./LessonList/LessonList";
import AdminCalendar from "../Calendar/Calendar";
import StudentList from "./StudentList/StudentList";
import { LessonProvider } from "@/app/(context)/lessonContext";

export default function Dashboard() {
  return (
    <LessonProvider>
      <div className="min-h-[70vh]">
        <InstructorCard />
        <AdminCalendar />
        <LessonRequests />
        <LessonList />
        <StudentList />
      </div>
    </LessonProvider>
  );
}
