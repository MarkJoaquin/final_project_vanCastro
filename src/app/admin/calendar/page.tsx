"use client";

import AdminCalendar from "@/app/(components)/Calendar/Calendar";
import { Calendar } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="min-h-screen p-4 sm:p-0">
            <AdminCalendar />
        </div>
    );
}