"use client";

import { useEffect, useState } from "react";
import AdminTemplate from "../Template/AdminTemplate";
import { useAdminDataContext } from "@/app/(context)/adminContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ConfirmedLesson {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: string;
  plan: string;
  price: string;
  status: string;
  paymentStatus: string;
  trackingNumber: string;
  instructorId: string;
  // Campos adicionales que vienen del API
  licenseClass?: string;
  paymentMethod?: string;
  student: {
    name: string;
  };
  location: {
    name: string;
    city: string;
  };
}

export default function LessonList() {
  const [confirmedLessons, setConfirmedLessons] = useState<ConfirmedLesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { loginedInstructorData } = useAdminDataContext();
  const instructorId = loginedInstructorData?.id;

  useEffect(() => {
    const fetchConfirmedLessons = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/lessons/confirmed");
        if (!res.ok) {
          const errorData = await res.json();
          console.error("API error:", errorData);
          throw new Error(errorData.error || "Error fetching confirmed lessons");
        }
        const data = await res.json();
        console.log("Confirmed lessons received:", data);
        setConfirmedLessons(data);
      } catch (error) {
        console.error("Error fetching confirmed lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfirmedLessons();
  }, []);

  // Filtra las lecciones asignadas al instructor logeado
  const assignedLessons = confirmedLessons.filter(
    (lesson) => lesson.instructorId === instructorId
  );

  // Función para formatear la fecha
  const formatLessonDate = (dateString: string | Date) => {
    try {
      // Asegurarnos de que estamos trabajando con la fecha correcta sin problemas de zona horaria
      // Parseamos la fecha como UTC y luego la formateamos localmente
      let date;
      if (typeof dateString === 'string') {
        // Si es una fecha en formato ISO, extraemos solo la parte de la fecha (YYYY-MM-DD)
        const datePart = dateString.split('T')[0];
        // Creamos la fecha usando la parte de la fecha para evitar ajustes de zona horaria
        date = new Date(datePart + 'T00:00:00');
      } else {
        date = new Date(dateString);
      }
      
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  // Creamos un componente personalizado para el AdminMainComponent que usa el acordeón
  const CustomMainComponent = () => {
    if (isLoading) {
      return <p className="text-center py-4">Loading confirmed lessons...</p>;
    }
    
    if (assignedLessons.length === 0) {
      return <p className="text-center py-4">No confirmed lessons to display</p>;
    }
    
    return (
      <Accordion type="single" collapsible className="w-full">
        {assignedLessons.map((lesson) => (
          <AccordionItem key={lesson.id} value={lesson.id} className="mb-4 border-b border-gray-200">
            <AccordionTrigger className="flex justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold text-base">{lesson.student.name}</span>
                <span className="text-sm text-gray-600">
                  {formatLessonDate(lesson.date)} - {lesson.startTime} ~ {lesson.endTime}
                </span>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="bg-gray-50 px-6 py-4 rounded-b-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Lesson Details</h4>
                  <p><span className="text-gray-600">Plan:</span> {lesson.plan}</p>
                  <p><span className="text-gray-600">Duration:</span> {lesson.duration} minutes</p>
                  <p><span className="text-gray-600">Price:</span> ${lesson.price}</p>
                  <p><span className="text-gray-600">Status:</span> {lesson.status}</p>
                  <p><span className="text-gray-600">Payment Status:</span> {lesson.paymentStatus}</p>
                  {lesson.licenseClass && (
                    <p><span className="text-gray-600">License Class:</span> {lesson.licenseClass}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p>{lesson.location?.name || "No location"}</p>
                  {/* <p>{lesson.location?.city || "No city"}</p> */}
                  
                  <h4 className="font-semibold mt-3 mb-1">Additional Information</h4>
                  <p><span className="text-gray-600">Tracking Number:</span> {lesson.trackingNumber}</p>
                  {lesson.paymentMethod && (
                    <p><span className="text-gray-600">Payment Method:</span> {lesson.paymentMethod}</p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  // Componente principal
  return (
    <div className="w-full">
      <AdminTemplate
        PageTitle={"Confirmed Lessons"}
        SearchBar={true}
        Component={{
          // Estos campos son requeridos por AdminTemplate, pero usaremos un div personalizado
          Maincontents: [""],
          SubItems: [""],
        }}
      />
      
      <div className="w-[80%] m-auto mt-4">
        <CustomMainComponent />
      </div>
    </div>
  );
}