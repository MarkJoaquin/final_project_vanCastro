"use client";

import InstructorCard from "./InstructorCard/InstructorCard";
import AdminTemplate from "./Template/AdminTemplate";
import LessonRequests from "./LessonRequest/LessonRequest";
import LessonList from "./LessonList/LessonList";
import AdminCalendar from "../Calendar/Calendar";


export default function Dashboard() {
  return (
    <div className="min-h-[70vh]">
      <AdminCalendar/>
      
      <InstructorCard />
      <LessonRequests />
      <LessonList />
      
      <AdminTemplate
        PageTitle={"Student List"}
        SearchBar={true}
        Component={{
          Maincontents: ["One", "Two", "Three", "Four", "Five"],
          SubItems: ["one", "two", "three", "four", "five"],
          Date: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5"],
        }}
      />
      <AdminTemplate
        PageTitle={"Pending Action"}
        SearchBar={false}
        Component={{
          Maincontents: ["One", "Two", "Three", "Four", "Five"],
          SubItems: ["one", "two", "three", "four", "five"],
          WhenStartLesson: ["In 24 hours", "In 24 hours", "In 24 hours", "In 48 hours", "In 48 hours"],
        }}
      />
      
    </div>
  );
}
