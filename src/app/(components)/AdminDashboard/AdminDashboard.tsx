"use client";

import InstructorCard from "./InstructorCard/InstructorCard";
import AdminTemplate from "./Template/AdminTemplate";
import LessonRequests from "./LessonRequest/LessonRequest";
import LessonList from "./LessonList/LessonList";
import AdminCalendar from "../Calendar/Calendar";
import StudentList from "./StudentList/StudentList";
import { LessonProvider } from "@/app/(context)/lessonContext";
import Image from "next/image";
import { useAdminDataContext } from "@/app/(context)/adminContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { loginedInstructorData } = useAdminDataContext();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Determinar el saludo según la hora del día
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    // Actualizar la hora cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <LessonProvider>
      <div className="min-h-[70vh] p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl max-w-5xl mx-auto text-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <Image
                src="/images/welcome-admin.png"
                alt="Dashboard"
                width={300}
                height={300}
                className="mx-auto rounded-full border-4 border-white shadow-lg"
              />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-4xl font-bold mb-2 text-gray-800"
            >
              {greeting}, {loginedInstructorData?.name || "Instructor"}!
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-xl text-gray-600 mb-6"
            >
              Welcome to your Admin Dashboard
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-sm text-gray-500"
            >
              {currentTime.toLocaleDateString("en-US", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              <span className="mx-2">•</span>
              {currentTime.toLocaleTimeString("en-US", { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-blue-600">Upcoming Lessons</h3>
                <p className="text-gray-600">View your schedule</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-purple-600">New Requests</h3>
                <p className="text-gray-600">Review student bookings</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-semibold text-green-600">Student Progress</h3>
                <p className="text-gray-600">Track student development</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </LessonProvider>
  );
}
