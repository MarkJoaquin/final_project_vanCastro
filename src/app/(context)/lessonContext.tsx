"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ConfirmedLesson {
    id: string;
    studentId: string;
    instructorId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    locationId: string;
    plan: string;
    price: string;
    status: string;
    paymentStatus: string;
    licenseClass?: string;
    paymentMethod?: string;
    trackingNumber: string;
    createdAt: string;
    updatedAt: string;
    student: {
        name: string;
    };
    location: {
        name: string;
        city: string;
    };
}

interface LessonContextType {
    confirmedLessons: ConfirmedLesson[];
    isLoading: boolean;
    fetchConfirmedLessons: () => Promise<void>;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [confirmedLessons, setConfirmedLessons] = useState<ConfirmedLesson[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchConfirmedLessons = useCallback(async () => {
        setIsLoading(true);
        try {
        const res = await fetch("/api/lessons/confirmed");
        if (!res.ok) {
            throw new Error("Failed to fetch lessons");
        }
        const data = await res.json();
        setConfirmedLessons(data);
        } catch (error) {
        console.error("Error fetching lessons:", error);
        } finally {
        setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfirmedLessons();
    }, [fetchConfirmedLessons]);

    return (
        <LessonContext.Provider value={{ confirmedLessons, isLoading, fetchConfirmedLessons }}>
        {children}
        </LessonContext.Provider>
    );
    };

    export const useLessonContext = () => {
    const context = useContext(LessonContext);
    if (!context) {
        throw new Error("useLessonContext must be used within a LessonProvider");
    }
    return context;
};