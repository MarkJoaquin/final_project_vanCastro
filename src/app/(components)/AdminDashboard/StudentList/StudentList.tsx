"use client"

import { useEffect, useState } from "react";
import AdminTemplate from "../Template/AdminTemplate";
import { useAdminDataContext } from "@/app/(context)/adminContext" ;

interface LessonRequest {
    lessonPlan: string;
    lessonDate: string;
    startTime: string;
    endTime: string;
    lessonStatus: string;
    licenseClass: string;
    instructorId: string;
    student: {
        name: string; 
    };
}

export default function StudentList() {
  const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);
  const { loginedInstructorData } = useAdminDataContext();
  const instructorId = loginedInstructorData?.id;

  useEffect(() => {
    const fetchLessonRequests = async () => {
      try {
        const res = await fetch("/api/lessons/request");
        if (!res.ok) throw new Error("Error fetching lesson requests");
        const data = await res.json();
        setLessonRequests(data);
      } catch (error) {
        console.error("Error fetching lesson requests:", error);
      }
    };

    fetchLessonRequests();
  }, []);

  const assignedLessons = lessonRequests.filter(
    (lesson) => lesson.instructorId === instructorId
  );

  // Función para calcular la duración de la clase
  const calculateClassDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return durationInMinutes;
  };

  // Función para formatear subtítulo
  const formatLessonSubtitle = (lesson: LessonRequest): string => {
    const duration = calculateClassDuration(lesson.startTime, lesson.endTime);
    return `${duration} min`;
  };

  const formatLessonDate = (lesson: LessonRequest) => {
    const date = new Date(lesson.lessonDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    return `${date}`;
  };

  return (
    <AdminTemplate
      PageTitle={"Student List"}
      SearchBar={true}
      Component={{
        Maincontents: assignedLessons.map((lesson) => lesson.student.name),
        SubItems: assignedLessons.map((lesson) => `${lesson.licenseClass} Lesson of ${formatLessonSubtitle(lesson)}`),
        Date: assignedLessons.map((lesson) => formatLessonDate(lesson)),
      }}
    />
  );
}

 
