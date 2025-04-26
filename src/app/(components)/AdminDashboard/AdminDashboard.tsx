"use client";

import InstructorCard from "./InstructorCard/InstructorCard";
import AdminTemplate from "./Template/AdminTemplate";
import LessonRequests from "./LessonRequest/LessonRequest";
import LessonList from "./LessonList/LessonList";
import AdminCalendar from "../Calendar/Calendar";
import StudentList from "./StudentList/StudentList";
import { LessonProvider } from "@/app/(context)/lessonContext";
import Image from "next/image";


export default function Dashboard() {
  return (
    <LessonProvider>
      <div className="min-h-[70vh]">
        {/* <InstructorCard />
        <AdminCalendar />
        <LessonRequests />
        <LessonList />
        <StudentList /> */}
        <Image
          src="/images/welcome-admin.png"
          alt="Dashboard"
          width={600}
          height={600}
          className="mx-auto mt-10"
        />
      </div>
    </LessonProvider>
  );
}
