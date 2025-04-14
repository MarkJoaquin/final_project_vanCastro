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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface LessonRequest {
    id: string;
    lessonPlan: string;
    lessonDate: string;
    lessonLocation: string; 
    startTime: string;
    endTime: string;
    lessonDuration: string;
    lessonPrice: string;
    lessonStatus: string; 
    instructorId: string;
    trackingNumber: string;
    createdAt: string;
    licenseClass?: string;
    paymentMethod?: string;
    student: {
        name: string; 
        email?: string;
    };
}

interface Location {
    id: string;
    address: string;
    city: string;
}

export default function LessonRequests() {
    const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { loginedInstructorData } = useAdminDataContext(); 
    const instructorId = loginedInstructorData?.id;

    useEffect(() => {
        setIsLoading(true);
        
        const fetchLessonRequests = async () => {
            try {
                const res = await fetch("/api/lessons/request");
                if (!res.ok) throw new Error("Error fetching lesson requests");
                const data = await res.json();
                console.log("Lesson requests:", data);
                setLessonRequests(data); 
            } catch (error) {
                console.error("Error fetching lesson requests:", error);
            }
        };

        const fetchLocations = async () => {
            try {
                const res = await fetch("/api/locations");
                if (!res.ok) throw new Error("Error fetching locations");
                const data = await res.json();
                setLocations(data); 
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessonRequests();
        fetchLocations();
    }, []);

    // Filter lesson requests with lessonStatus = "REQUESTED" and instructorId matching the logged-in instructor
    // Apply name search filter if search query exists
    const filteredRequests = lessonRequests
        .filter((request) => {
            const matchesStatus = request.lessonStatus === "REQUESTED";
            const matchesInstructor = request.instructorId === instructorId;
            
            // Search filter for student name
            const matchesSearch = searchQuery.trim() === "" || 
                request.student.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesStatus && matchesInstructor && matchesSearch;
        })
        // Ordenar por fecha y hora, mostrando primero las lecciones más próximas
        .sort((a, b) => {
            // Primero comparamos por fecha
            const dateA = new Date(a.lessonDate);
            const dateB = new Date(b.lessonDate);
            
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

    // Function to format the date and time in a more complete format
    const formatLessonDate = (dateString: string) => {
        try {
            // Asegurarnos de que estamos trabajando con la fecha correcta sin problemas de zona horaria
            // Extraemos solo la parte de la fecha (YYYY-MM-DD) para evitar problemas con zonas horarias
            const datePart = dateString.split('T')[0];
            // Creamos la fecha usando la parte de la fecha para evitar ajustes de zona horaria
            const date = new Date(datePart + 'T00:00:00');
            
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

    // Function to get the address of a location
    const getLocationAddress = (locationId: string) => {
        const location = locations.find((loc) => loc.id === locationId);
        return location ? `${location.address}, ${location.city}` : "Unknown location";
    };
    
    // Function to handle accepting a booking request
    const handleAcceptRequest = async (requestId: string) => {
        try {
            setIsLoading(true);
            console.log("Accepting request:", requestId);
            
            const response = await fetch("/api/lessons/accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error accepting request:", data.error);
                toast.error(`Error: ${data.error}`, {
                    description: "Please try again or contact support if the problem persists.",
                    duration: 5000
                });
                return;
            }
            
            console.log("Request accepted successfully:", data);
            
            // Refrescar la lista de solicitudes para que esta ya no aparezca
            const updatedRequests = lessonRequests.filter(req => req.id !== requestId);
            setLessonRequests(updatedRequests);
            
            toast.success("Booking request accepted!", {
                description: "The lesson has been confirmed and added to your schedule.",
                duration: 4000
            });
        } catch (error) {
            console.error("Error accepting request:", error);
            toast.error("Request failed", {
                description: "An error occurred while accepting the request. Please try again.",
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Function to handle declining a booking request
    const handleDeclineRequest = async (requestId: string) => {
        try {
            setIsLoading(true);
            console.log("Declining request:", requestId);
            
            const response = await fetch("/api/lessons/decline", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ requestId }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error declining request:", data.error);
                toast.error(`Error: ${data.error}`, {
                    description: "Please try again or contact support if the problem persists.",
                    duration: 5000
                });
                return;
            }
            
            console.log("Request declined successfully:", data);
            
            // Refrescar la lista de solicitudes para que esta ya no aparezca
            const updatedRequests = lessonRequests.filter(req => req.id !== requestId);
            setLessonRequests(updatedRequests);
            
            toast.success("Booking request declined", {
                description: "The student will be notified that their request was declined.",
                duration: 4000
            });
        } catch (error) {
            console.error("Error declining request:", error);
            toast.error("Request failed", {
                description: "An error occurred while declining the request. Please try again.",
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Función para determinar a qué sección pertenece una solicitud basándose en su fecha
    const getRequestSection = (dateStr: string): string => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const requestDate = new Date(dateStr);
        requestDate.setHours(0, 0, 0, 0); // Normalizar a inicio del día
        
        if (requestDate.getTime() === today.getTime()) {
            return "Today";
        } else if (requestDate.getTime() === tomorrow.getTime()) {
            return "Tomorrow";
        } else if (requestDate > today && requestDate < nextWeek) {
            return "This Week";
        } else {
            return "Upcoming";
        }
    };
    
    // Agrupar las solicitudes por sección
    const groupRequestsBySection = () => {
        const grouped: Record<string, LessonRequest[]> = {
            "Today": [],
            "Tomorrow": [],
            "This Week": [],
            "Upcoming": []
        };
        
        filteredRequests.forEach(request => {
            const section = getRequestSection(request.lessonDate);
            grouped[section].push(request);
        });
        
        return grouped;
    };
    
    // Crear un componente personalizado para el AdminMainComponent que use el acordeón
    const CustomMainComponent = () => {
        if (isLoading) {
            return <p className="text-center py-4">Loading booking requests...</p>;
        }
        
        if (filteredRequests.length === 0) {
            return <p className="text-center py-4">No booking requests to display</p>;
        }
        
        const groupedRequests = groupRequestsBySection();
        const sections = ["Today", "Tomorrow", "This Week", "Upcoming"];
        
        return (
            <div className="w-full space-y-6">
                {sections.map(section => {
                    const requests = groupedRequests[section];
                    
                    if (requests.length === 0) {
                        return null; // No mostrar secciones vacías
                    }
                    
                    return (
                        <div key={section} className="mb-4">
                            <h3 className="text-lg font-semibold mb-3 px-2 py-1 bg-gray-100 rounded">{section}</h3>
                            <Accordion type="single" collapsible className="w-full">
                                {requests.map((request) => (
                    <AccordionItem key={request.id} value={request.id} className="mb-4 border-b border-gray-200">
                        <AccordionTrigger className="flex justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="flex flex-col items-start text-left">
                                <span className="font-semibold text-base">{request.student.name}</span>
                                <span className="text-sm text-gray-600">
                                    {formatLessonDate(request.lessonDate)} - {request.startTime} ~ {request.endTime}
                                </span>
                            </div>
                        </AccordionTrigger>
                        
                        <AccordionContent className="bg-gray-50 px-6 py-4 rounded-b-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-1">Lesson Details</h4>
                                    <p><span className="text-gray-600">Plan:</span> {request.lessonPlan}</p>
                                    <p><span className="text-gray-600">Duration:</span> {request.lessonDuration} minutes</p>
                                    <p><span className="text-gray-600">Price:</span> ${request.lessonPrice}</p>
                                    <p><span className="text-gray-600">Status:</span> {request.lessonStatus}</p>
                                    {request.licenseClass && (
                                        <p><span className="text-gray-600">License Class:</span> {request.licenseClass}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold mb-1">Location</h4>
                                    <p>{getLocationAddress(request.lessonLocation)}</p>
                                    
                                    <h4 className="font-semibold mt-3 mb-1">Additional Information</h4>
                                    <p><span className="text-gray-600">Tracking Number:</span> {request.trackingNumber}</p>
                                    <p><span className="text-gray-600">Created:</span> {new Date(request.createdAt).toLocaleDateString()}</p>
                                    {request.paymentMethod && (
                                        <p><span className="text-gray-600">Payment Method:</span> {request.paymentMethod}</p>
                                    )}
                                    
                                    <div className="mt-4 flex space-x-3">
                                        <Button 
                                            onClick={() => handleAcceptRequest(request.id)} 
                                            className="bg-[#FFCE47] text-black hover:bg-amber-400 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Processing..." : "Accept"}
                                        </Button>
                                        <Button 
                                            onClick={() => handleDeclineRequest(request.id)} 
                                            className="bg-white border border-black text-black hover:bg-gray-100 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Processing..." : "Decline"}
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

    // Handler para el cambio en el input de búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="w-full">
            <div className="w-[80%] m-auto mt-[2rem]">
                <div className="flex justify-between items-center flex-wrap gap-[0.5rem]">
                    <h2 className="text-2xl font-bold">Booking Requests</h2>
                    <div className="flex gap-[1rem]">
                        <Input
                            placeholder="Student name"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-white py-5"
                        />
                    </div>
                </div>
            </div>
            
            <div className="w-[80%] m-auto mt-4">
                <CustomMainComponent />
            </div>
        </div>
    );
}