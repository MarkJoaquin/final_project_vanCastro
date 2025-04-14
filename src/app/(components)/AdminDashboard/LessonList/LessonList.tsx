"use client";

import { useEffect, useState } from "react";
import AdminTemplate from "../Template/AdminTemplate";
import { useAdminDataContext } from "@/app/(context)/adminContext"; // Importa el contexto

interface LessonRequest {
  lessonPlan: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  instructorId: string; // Agrega el campo instructorId
  student: {
    name: string; // Nombre del estudiante
  };
}

export default function LessonList() {
  const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);
  const { loginedInstructorData } = useAdminDataContext(); // Obtén los datos del instructor logeado
  const instructorId = loginedInstructorData?.id;

  useEffect(() => {
    const fetchLessonRequests = async () => {
      try {
        const res = await fetch("/api/lessons/request");
        if (!res.ok) throw new Error("Error fetching lesson requests");
        const data = await res.json();
        setLessonRequests(data); // Almacena las solicitudes en el estado
      } catch (error) {
        console.error("Error fetching lesson requests:", error);
      }
    };

    fetchLessonRequests();
  }, []);

  // Filtra las lecciones asignadas al instructor logeado
  const assignedLessons = lessonRequests.filter(
    (lesson) => lesson.instructorId === instructorId
  );

  // Función para formatear la fecha y el tiempo
  const formatLessonSubtitle = (lesson: LessonRequest) => {
    const date = new Date(lesson.lessonDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    return `${date} - ${lesson.startTime} ~ ${lesson.endTime}`;
  };

  return (
    <AdminTemplate
      PageTitle={"Lesson List"}
      SearchBar={true}
      Component={{
        Maincontents: assignedLessons.map((lesson) => lesson.student.name), // Nombre del estudiante como título
        SubItems: assignedLessons.map((lesson) => formatLessonSubtitle(lesson)), // Fecha y tiempo como subtítulo
      }}
    />
  );
}