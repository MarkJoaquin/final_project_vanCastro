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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddNewLessonModal from "../Modals/AddNewLessonModal";
import styles from "../LessonList/LessonList.module.css"; // Importing the CSS module

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

interface LicenseClass {
  id: string;
  name: string;
}

export default function LessonList() {
  const [confirmedLessons, setConfirmedLessons] = useState<ConfirmedLesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddLessonModal, setShowAddLessonModal] = useState<boolean>(false);
  const { loginedInstructorData } = useAdminDataContext();
  const instructorId = loginedInstructorData?.id;
  const [licenseClasses, setLicenseClasses] = useState<LicenseClass[]>([]);

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

  const fetchLicenseClasses = async () => {
    try {
      const res = await fetch("/api/plans/classes");
      if (!res.ok) {
        console.error("Failed to fetch license classes");
        return;
      }
      const data = await res.json();
      setLicenseClasses(data);
    } catch (error) {
      console.error("Error fetching license classes:", error);
    }
  }

  useEffect(() => {
    fetchConfirmedLessons();
    fetchLicenseClasses()
  }, []);

  // Filtra las lecciones asignadas al instructor logeado y por nombre de estudiante si hay búsqueda
  const assignedLessons = confirmedLessons
    .filter((lesson) => {
      // Filtro por instructor
      const matchesInstructor = lesson.instructorId === instructorId;
      
      // Filtro por nombre de estudiante (si hay término de búsqueda)
      const matchesSearch = searchQuery.trim() === "" || 
        lesson.student.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesInstructor && matchesSearch;
    })
    // Ordenar por fecha y hora, mostrando primero las lecciones más próximas
    .sort((a, b) => {
      // Primero comparamos por fecha
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime(); // Orden ascendente por fecha
      }
      
      // Si las fechas son iguales, comparamos por hora de inicio
      const [hoursA, minutesA] = a.startTime.split(':').map(Number);
      const [hoursB, minutesB] = b.startTime.split(':').map(Number);
      
      const timeA = hoursA * 60 + minutesA;
      const timeB = hoursB * 60 + minutesB;
      
      return timeA - timeB; // Orden ascendente por hora
    });

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

  // Función para determinar a qué sección pertenece una lección basándose en su fecha
  const getLessonSection = (dateStr: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lessonDate = new Date(dateStr);
    lessonDate.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    
    if (lessonDate.getTime() === today.getTime()) {
      return "Today";
    } else if (lessonDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (lessonDate > today && lessonDate < nextWeek) {
      return "This Week";
    } else {
      return "Upcoming";
    }
  };
  
  // Agrupar las lecciones por sección
  const groupLessonsBySection = () => {
    const grouped: Record<string, ConfirmedLesson[]> = {
      "Today": [],
      "Tomorrow": [],
      "This Week": [],
      "Upcoming": []
    };
    
    assignedLessons.forEach(lesson => {
      const section = getLessonSection(lesson.date);
      grouped[section].push(lesson);
    });
    
    return grouped;
  };
  
  // Creamos un componente personalizado para el AdminMainComponent que usa el acordeón
  const CustomMainComponent = () => {
    if (isLoading) {
      return <p className="text-center py-4">Loading confirmed lessons...</p>;
    }
    
    if (assignedLessons.length === 0) {
      return <p className="text-center py-4">No confirmed lessons to display</p>;
    }
    
    const groupedLessons = groupLessonsBySection();
    const sections = ["Today", "Tomorrow", "This Week", "Upcoming"];

    // Map licenseClass ID to name
  const getLicenseClassName = (id?: string) => {
    if (!id) return "";
    const found = licenseClasses.find((lc) => lc.id === id);
    return found ? found.name : id;
  };
    
    return (
      <div className="w-full space-y-6 m-auto">
    
        {sections.map(section => {
          const lessons = groupedLessons[section];
          
          if (lessons.length === 0) {
            return null; // No mostrar secciones vacías
          }
          
          return (
            <div className={styles.acordionContainer} key={section}>
<div key={section} className= {`${styles.acordionSection} mb-4  `}>
              <h3 className={`${styles.section} text-lg font-semibold mb-3 px-2 py-1 bg-gray-100 rounded `}>{section}</h3>
              <Accordion type="single" collapsible className="w-full">
                {lessons.map((lesson) => (
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
              <div className={`${styles.lessonDetails} grid grid-cols-2 gap-4 `}>
                <div>
                    <h4 className={`${styles.title}"font-semibold mb-1"`}>Lesson Details</h4>
                    <p><span className="text-gray-600">Plan:</span> {lesson.plan}</p>
                    <p><span className="text-gray-600">Duration:</span> {lesson.duration} minutes</p>
                    <p><span className="text-gray-600">Price:</span> ${lesson.price}</p>
                    <p><span className="text-gray-600">Status:</span> {lesson.status}</p>
                    <p><span className="text-gray-600">Payment Status:</span> {lesson.paymentStatus}</p>
                    {lesson.licenseClass && (
                      <p><span className="text-gray-600">License Class:</span> {getLicenseClassName(lesson.licenseClass)}</p>
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
            </div>
          
            </div>
          
            
          );
        })}
        
      </div>
    );
  };

  // Handler para el cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Componente principal
  return (
    <div className="w-full">
      <div className={`${styles.LessonSection} w-[80%] m-auto mt-[2rem]`}>
        <div className="flex justify-between items-center flex-wrap gap-[0.5rem]">
          <h2 className={`${styles.title} text-2xl font-bold `}>Confirmed Lessons</h2>
          <div className="flex gap-[1rem]">
            <Input
              placeholder="Student name"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white py-5"
            />
            <Button
              onClick={() => setShowAddLessonModal(true)}
              className="bg-[#FFCE47] text-black hover:bg-amber-400 cursor-pointer"
            >
              Add New Lesson
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-[80%] m-auto mt-4">
        <CustomMainComponent />
      </div>

      {/* Add New Lesson Modal */}
      {showAddLessonModal && (
        <AddNewLessonModal
          isOpen={showAddLessonModal}
          onClose={() => setShowAddLessonModal(false)}
          instructorId={instructorId || ''}
          onSuccess={() => {
            setShowAddLessonModal(false);
            fetchConfirmedLessons();
            toast.success("Lesson added successfully");
          }}
        />
      )}
    </div>
  );
}