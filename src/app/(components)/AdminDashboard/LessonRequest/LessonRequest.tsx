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
    const filteredRequests = lessonRequests.filter(
        (request) =>
        request.lessonStatus === "REQUESTED" && request.instructorId === instructorId
    );

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
    const handleAcceptRequest = (requestId: string) => {
        console.log("Accepting request:", requestId);
        // TODO: Implement API call to accept the request
    };
    
    // Function to handle declining a booking request
    const handleDeclineRequest = (requestId: string) => {
        console.log("Declining request:", requestId);
        // TODO: Implement API call to decline the request
    };
    
    // Crear un componente personalizado para el AdminMainComponent que use el acordeón
    const CustomMainComponent = () => {
        if (isLoading) {
            return <p className="text-center py-4">Loading booking requests...</p>;
        }
        
        if (filteredRequests.length === 0) {
            return <p className="text-center py-4">No booking requests to display</p>;
        }
        
        return (
            <Accordion type="single" collapsible className="w-full">
                {filteredRequests.map((request) => (
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
                                        <Button onClick={() => handleAcceptRequest(request.id)} className="bg-[#FFCE47] text-black hover:bg-amber-400">
                                            Accept
                                        </Button>
                                        <Button onClick={() => handleDeclineRequest(request.id)} className="bg-white border border-black text-black hover:bg-gray-100">
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    };

    return (
        <div className="w-full">
            <AdminTemplate
                PageTitle={"Booking Requests"}
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