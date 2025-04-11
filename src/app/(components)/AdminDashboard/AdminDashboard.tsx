"use client";

import InstructorCard from "./InstructorCard/InstructorCard";
import AdminTemplate from "./Template/AdminTemplate";
import LessonRequests from "./LessonRequest/LessonRequest";

export default function Dashboard() {
  return (
    <div className="min-h-[70vh]">
      {/* Componente para mostrar la información del instructor */}
      <InstructorCard />

      {/* Componente para mostrar las solicitudes de lección */}
      <LessonRequests />

      {/* Mantén los templates existentes */}
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
      <AdminTemplate
        PageTitle={"Lesson List"}
        SearchBar={true}
        AddNewBtn={true}
        PeriodBtn={true}
        Component={{
          Maincontents: ["One", "Two", "Three", "Four", "Five"],
          SubItems: ["one", "two", "three", "four", "five"],
        }}
      />
    </div>
  );
}
