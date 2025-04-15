"use client";

import { useEffect } from "react";
import { useAdminDataContext } from "@/app/(context)/adminContext";

export default function InstructorCard() {
    const { loginedInstructorData, updateAllInstructorData, updateLoginedInstructorData } = useAdminDataContext();

    useEffect(() => {
        const fetchInstructors = async () => {
        try {
            const res = await fetch("/api/instructors"); // Endpoint para obtener todos los instructores
            const data = await res.json();
            updateAllInstructorData(data); // Actualiza todos los instructores en el contexto

        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
        };

        if (!loginedInstructorData) {
        fetchInstructors();
        }
    }, [loginedInstructorData, updateAllInstructorData, updateLoginedInstructorData]);

    return (
        <div className="m-5">
        {loginedInstructorData ? (
            <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-xl font-bold pb-5">Welcome, {loginedInstructorData.name}</h2>
            <p><strong>Email:</strong> {loginedInstructorData.email}</p>
            <p><strong>Teléfono:</strong> {loginedInstructorData.phone}</p>
            {loginedInstructorData.licenseNumber && (
                <p><strong>Número de Licencia:</strong> {loginedInstructorData.licenseNumber}</p>
            )}
            {loginedInstructorData.experienceYears && (
                <p><strong>Años de Experiencia:</strong> {loginedInstructorData.experienceYears}</p>
            )}
            </div>
        ) : (
            <p className="text-red-500">Loading...</p>
        )}
        </div>
    );
}