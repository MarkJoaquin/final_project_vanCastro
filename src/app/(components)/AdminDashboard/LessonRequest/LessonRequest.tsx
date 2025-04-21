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
import { CheckCircle, XCircle, Mail, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    
    // Diálogo de confirmación
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {});
    const [confirmTitle, setConfirmTitle] = useState<string>("");
    const [confirmDescription, setConfirmDescription] = useState<string>("");
    const [confirmButtonText, setConfirmButtonText] = useState<string>("Confirm");

    const { loginedInstructorData } = useAdminDataContext(); 
    const instructorId = loginedInstructorData?.id;

    const fetchLessonRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/lessons/request");
            if (!res.ok) throw new Error("Error fetching lesson requests");
            const data = await res.json();
            console.log("Lesson requests:", data);
            setLessonRequests(data); 
        } catch (error) {
            console.error("Error fetching lesson requests:", error);
        } finally {
            setIsLoading(false);
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
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            await Promise.all([fetchLessonRequests(), fetchLocations()]);
            setIsLoading(false);
        };
        
        fetchInitialData();
    }, []);

    // Filter lesson requests with lessonStatus = "REQUESTED" or "AWAITING_PAYMENT" and instructorId matching the logged-in instructor
    // Apply name search filter if search query exists
    const filteredRequests = lessonRequests
        .filter((request) => {
            const matchesStatus = request.lessonStatus === "REQUESTED" || request.lessonStatus === "AWAITING_PAYMENT";
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
        // Setup confirmación
        const request = lessonRequests.find((req: LessonRequest) => req.id === requestId);
        const studentName = request?.student.name || 'the student';
        
        if (request?.lessonStatus === "AWAITING_PAYMENT") {
            setConfirmTitle(`Confirm Lesson Payment?`);
            setConfirmDescription(`Are you sure you want to confirm the payment for the lesson from ${studentName}? This will create the lesson in the system.`);
            setConfirmButtonText("Confirm Lesson");
        } else {
            setConfirmTitle(`Accept Lesson Request?`);
            setConfirmDescription(`Are you sure you want to accept the lesson request from ${studentName}?`);
            setConfirmButtonText("Accept");
        }
        
        // Preparar acción que se ejecutará si el usuario confirma
        setConfirmAction(() => async () => {
            try {
                setIsLoading(true);
                console.log("Accepting request:", requestId);
                
                // 1. Aceptar la solicitud
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
                
                // 2. Enviar correo de notificación al estudiante
                try {
                    const emailResponse = await fetch("/api/send-acceptance-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ requestId }),
                    });
                    
                    if (emailResponse.ok) {
                        console.log("Acceptance email sent successfully");
                    } else {
                        console.warn("Failed to send acceptance email", await emailResponse.json());
                    }
                } catch (emailError) {
                    console.error("Error sending acceptance email:", emailError);
                    // No interrumpimos el flujo si falla el envío del correo
                }
                
                // Refrescar la lista de solicitudes para que esta ya no aparezca
                setLessonRequests((prevRequests: LessonRequest[]) => 
                    prevRequests.filter((req: LessonRequest) => req.id !== requestId)
                );
                
                const actionText = request?.lessonStatus === "AWAITING_PAYMENT" ? "confirmed" : "accepted";
                
                toast.success(`Booking request ${actionText}!`, {
                    description: `The lesson has been ${actionText} and a notification email has been sent to the student.`,
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
        });
        
        // Mostrar diálogo
        setConfirmDialogOpen(true);
    };
    
    // Function to handle declining a booking request
    const handleDeclineRequest = async (requestId: string) => {
        // Buscar los detalles de la solicitud para mostrarlos en la confirmación
        const requestDetails = lessonRequests.find((req: LessonRequest) => req.id === requestId);
        const studentName = requestDetails?.student.name || 'this student';
        
        // Setup confirmación según el estado de la solicitud
        if (requestDetails?.lessonStatus === "AWAITING_PAYMENT") {
            setConfirmTitle(`Cancel Payment Request?`);
            setConfirmDescription(`Are you sure you want to cancel the payment request for ${studentName}? This will return the lesson to REJECTED status.`);
            setConfirmButtonText("Cancel Payment");
        } else {
            setConfirmTitle(`Decline Lesson Request?`);
            setConfirmDescription(`Are you sure you want to decline the lesson request from ${studentName}? This action cannot be undone.`);
            setConfirmButtonText("Decline");
        }
        
        // Preparar acción que se ejecutará si el usuario confirma
        setConfirmAction(() => async () => {
            setIsLoading(true);
            try {
                // 1. Rechazar la solicitud
                const response = await fetch(`/api/lessons/decline`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ requestId })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to decline request");
                }

                const updatedRequest = await response.json();
                
                // 2. Enviar correo de notificación al estudiante
                try {
                    const emailResponse = await fetch("/api/send-rejection-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ requestId }),
                    });
                    
                    if (emailResponse.ok) {
                        console.log("Rejection email sent successfully");
                    } else {
                        console.warn("Failed to send rejection email", await emailResponse.json());
                    }
                } catch (emailError) {
                    console.error("Error sending rejection email:", emailError);
                    // No interrumpimos el flujo si falla el envío del correo
                }
                
                // Update the local state with the updated request
                setLessonRequests((prevRequests: LessonRequest[]) => 
                    prevRequests.filter((req: LessonRequest) => req.id !== requestId)
                );

                // Mensaje personalizado según el estado que tenía la solicitud
                const actionText = requestDetails?.lessonStatus === "AWAITING_PAYMENT" ? "cancelled" : "declined";
                
                toast.success(`Booking request ${actionText} successfully`, {
                    description: "A notification email has been sent to the student.",
                    duration: 4000
                });
                
                // Optionally refresh the data
                fetchLessonRequests();
            } catch (error) {
                console.error("Error declining request:", error);
                toast.error(error instanceof Error ? error.message : "Failed to decline request");
            } finally {
                setIsLoading(false);
            }
        });
        
        // Mostrar diálogo
        setConfirmDialogOpen(true);
    };

    // Function to handle sending invoice to the student
    const handleSendInvoice = async (requestId: string) => {
        const request = lessonRequests.find(req => req.id === requestId);
        const studentName = request?.student.name || 'the student';
        
        // Setup confirmación
        setConfirmTitle(`Send Invoice?`);
        setConfirmDescription(`Send invoice to ${studentName} for the lesson with tracking number ${request?.trackingNumber}?`);
        setConfirmButtonText("Send Invoice");
        
        // Preparar acción que se ejecutará si el usuario confirma
        setConfirmAction(() => async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/send-invoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ requestId })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to send invoice');
                }

                // Actualizar el estado local para reflejar el cambio a AWAITING_PAYMENT
                setLessonRequests((prevRequests: LessonRequest[]) => 
                    prevRequests.map((req: LessonRequest) => 
                        req.id === requestId ? { ...req, lessonStatus: "AWAITING_PAYMENT" } : req
                    )
                );

                const request = lessonRequests.find((req: LessonRequest) => req.id === requestId);
                const studentName = request?.student.name || 'the student';
                
                toast.success(`Invoice sent successfully!`, {
                    description: `The invoice has been sent to ${studentName} and status updated to AWAITING FOR PAYMENT.`,
                    duration: 4000
                });
            } catch (error) {
                console.error('Error sending invoice:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to send invoice');
            } finally {
                setIsLoading(false);
            }
        });
        
        // Mostrar diálogo
        setConfirmDialogOpen(true);
    };

    // Función para determinar a qué sección pertenece una solicitud basándose en su fecha
    const getRequestSection = (dateStr: string): string => {
        // Fecha actual
        const today = new Date();
        // console.log('Today:', today);
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Convertir el string de fecha a componentes consistentes
        const rawDate = new Date(dateStr);
        const dateParts = rawDate.toISOString().split('T')[0].split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Meses en JS son 0-11
        const day = parseInt(dateParts[2]);
        
        // Crear fecha local sin problemas de zona horaria
        const requestDate = new Date(year, month, day);
        // console.log('Request Date:', requestDate);

        // Comparaciones
        if (requestDate < today) {
            return "Past";
        }else if (requestDate.getTime() === today.getTime()) {
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
            "Past": [],
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
        const sections = ["Past", "Today", "Tomorrow", "This Week", "Upcoming"];
        
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
                                    <p>
                                        <span className="text-gray-600">Status: </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.lessonStatus)}`}>
                                           {request.lessonStatus === "AWAITING_PAYMENT" ? "AWAITING FOR PAYMENT" : request.lessonStatus}
                                        </span>
                                    </p>
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
                                    
                                    <div className="mt-4 flex space-x-3 flex-wrap gap-2">
                                        <Button 
                                            onClick={() => handleAcceptRequest(request.id)} 
                                            className="bg-[#FFCE47] text-black hover:bg-amber-400 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Processing..." : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    {request.lessonStatus === "AWAITING_PAYMENT" ? "Confirm Lesson" : "Accept"}
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            onClick={() => handleDeclineRequest(request.id)} 
                                            className="bg-white border border-black text-black hover:bg-gray-100 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Processing..." : (
                                                <>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Decline
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            onClick={() => handleSendInvoice(request.id)} 
                                            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                            disabled={isLoading || !request.student.email}
                                            title={!request.student.email ? "Student email not available" : "Send invoice to student"}
                                        >
                                            {isLoading ? "Processing..." : (
                                                <>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Invoice
                                                </>
                                            )}
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

    // Función para obtener el color de fondo según el estado de la solicitud
    const getStatusColor = (status: string) => {
        switch (status) {
            case "REQUESTED":
                return "bg-gray-200 text-gray-800"; // Gris para solicitudes nuevas
            case "AWAITING_PAYMENT":
                return "bg-[#FFCE47] text-black"; // Amarillo (color primario) para pagos pendientes
            case "CONFIRMED":
                return "bg-green-500 text-white"; // Verde para confirmadas
            case "REJECTED":
                return "bg-red-500 text-white"; // Rojo para rechazadas
            case "LATE_RESPONSE":
                return "bg-orange-400 text-white"; // Naranja para respuestas tardías
            default:
                return "bg-gray-100 text-gray-800";
        }
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

            {/* Diálogo de confirmación */}
            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await confirmAction();
                                setConfirmDialogOpen(false);
                            }}
                            className={confirmButtonText === "Decline" ? "bg-red-500 hover:bg-red-600" : 
                                     confirmButtonText === "Send Invoice" ? "bg-blue-500 hover:bg-blue-600" : 
                                     "bg-[#FFCE47] hover:bg-amber-400 text-black"}
                        >
                            {confirmButtonText === "Accept" ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4 inline" />
                                    {confirmButtonText}
                                </>
                            ) : confirmButtonText === "Decline" ? (
                                <>
                                    <XCircle className="mr-2 h-4 w-4 inline" />
                                    {confirmButtonText}
                                </>
                            ) : confirmButtonText === "Send Invoice" ? (
                                <>
                                    <Mail className="mr-2 h-4 w-4 inline" />
                                    {confirmButtonText}
                                </>
                            ) : (
                                confirmButtonText
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}