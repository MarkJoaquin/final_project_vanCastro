"use client";

import { useEffect, useState } from "react";
import AdminTemplate from "../Template/AdminTemplate";
import { useAdminDataContext } from "@/app/(context)/adminContext";

interface LessonRequest {
    lessonPlan: string;
    lessonDate: string;
    lessonLocation: string; 
    startTime: string;
    endTime: string;
    lessonStatus: string; 
    instructorId: string; 
    student: {
        name: string; 
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

        fetchLessonRequests();
        fetchLocations();
    }, []);

    // Filter lesson requests with lessonStatus = "REQUESTED" and instructorId matching the logged-in instructor
    const filteredRequests = lessonRequests.filter(
        (request) =>
        request.lessonStatus === "REQUESTED" && request.instructorId === instructorId
    );

    // Function to format the date and time
    const formatLessonTitle = (lesson: LessonRequest) => {
        const date = new Date(lesson.lessonDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        });
        return `${date} - ${lesson.startTime} ~ ${lesson.endTime}`;
    };

    // Function to get the address of a location
    const getLocationAddress = (locationId: string) => {
        const location = locations.find((loc) => loc.id === locationId);
        return location ? `${location.address}, ${location.city}` : "Unknown location";
    };

    return (
        <AdminTemplate
        PageTitle={"Booking Request"}
        SearchBar={true}
        Component={{
            Maincontents: filteredRequests.map((request) => formatLessonTitle(request)), // Date and time as title
            SubItems: filteredRequests.map(
            (request) => `${request.student.name} @${getLocationAddress(request.lessonLocation)}`
            ), 
            AcceptBtn: true,
        }}
        />
    );
}