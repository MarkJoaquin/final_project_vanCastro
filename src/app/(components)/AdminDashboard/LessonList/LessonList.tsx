"use client";

import { useState, useEffect } from "react";
import { useLessonContext } from "@/app/(context)/lessonContext";
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
import ImageViewer from "../../ImageViewer/ImageViewer";
import { MessageCircle } from "lucide-react";

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
    phone?: string;
    hasLicense?: boolean;
    learnerPermitUrl?: string;
    licenses?: {
      licenseNumber: string;
      licenseType: string;
      expirationDate: Date;
    }[];
  };
  location: {
    name: string;
    city: string;
  };
}

export default function LessonList() {
  const [confirmedLessons, setConfirmedLessons] = useState<ConfirmedLesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddLessonModal, setShowAddLessonModal] = useState<boolean>(false);
  const { loginedInstructorData } = useAdminDataContext();
  const instructorId = loginedInstructorData?.id;

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

  useEffect(() => {
    fetchConfirmedLessons();
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
    
    return (
      <div className="w-full">
        {sections.map(section => {
          const lessons = groupedLessons[section];
          
          if (lessons.length === 0) {
            return null; // No mostrar secciones vacías
          }
          
          return (
            <div key={section} className="mb-4">
              <h3 className="text-lg font-semibold mb-3 px-2 py-1 bg-gray-100 rounded">{section}</h3>
              <Accordion type="single" collapsible className="w-full">
                {lessons.map((lesson) => (
          <AccordionItem key={lesson.id} value={lesson.id} className="mb-4 border-b border-gray-200">
            <AccordionTrigger className="flex justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex flex-col items-start text-left w-full overflow-hidden">
                <span className="font-semibold text-base truncate w-full">{lesson.student.name}</span>
                <span className="text-sm text-gray-600 truncate w-full">
                  {formatLessonDate(lesson.date)} - {lesson.startTime} ~ {lesson.endTime}
                </span>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="bg-gray-50 px-4 sm:px-6 py-4 rounded-b-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  {/* Student ID Verification Section */}
                  <h4 className="font-semibold mt-3 mb-1">Student ID Verification</h4>
                  {lesson.student.learnerPermitUrl ? (
                    <div className="mt-2">
                      <p><span className="text-gray-600">Learner Permit:</span></p>
                      <ImageViewer 
                        imageUrl={lesson.student.learnerPermitUrl} 
                        altText="Learner Permit" 
                      />
                    </div>
                  ) : lesson.student.hasLicense && lesson.student.licenses && lesson.student.licenses.length > 0 ? (
                    <div className="mt-2">
                      <p><span className="text-gray-600">License Number:</span> {lesson.student.licenses[0].licenseNumber}</p>
                      <p><span className="text-gray-600">License Type:</span> {lesson.student.licenses[0].licenseType}</p>
                      <p><span className="text-gray-600">Expiration Date:</span> {new Date(lesson.student.licenses[0].expirationDate).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <p><span className="text-gray-600">No ID verification provided</span></p>
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
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => {
                        // Formatear el número de teléfono para WhatsApp (eliminar espacios, paréntesis, etc.)
                        const phoneNumber = lesson.student.phone ? 
                          lesson.student.phone.replace(/[\s()-]/g, '') : '';
                        
                        if (!phoneNumber) {
                          toast.error("Student phone number not available");
                          return;
                        }
                        
                        // Formatear el mensaje con detalles de la lección
                        const message = `Hello ${lesson.student.name}, I'm your driving instructor regarding your confirmed lesson on ${formatLessonDate(lesson.date)} at ${lesson.startTime}.`;
                        
                        // Crear la URL de WhatsApp
                        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                        
                        // Abrir WhatsApp en una nueva pestaña
                        window.open(whatsappUrl, '_blank');
                      }} 
                      className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                      disabled={!lesson.student.phone}
                      title={!lesson.student.phone ? "Student phone number not available" : "Contact student via WhatsApp"}
                    >
                      <MessageCircle className="mr-2 h-4 w-4 " />
                      Contact via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        })}
      </div>
    );
  };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

  // Componente principal
  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Confirmed Lessons</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search student name"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white py-5 w-full"
            />
            <Button
              onClick={() => setShowAddLessonModal(true)}
              className="bg-[#FFCE47] text-black hover:bg-amber-400 cursor-pointer w-full sm:w-auto whitespace-nowrap"
            >
              Add New Lesson
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
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


