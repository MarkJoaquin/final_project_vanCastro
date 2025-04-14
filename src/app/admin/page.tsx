"use client";

export interface Instructor {
  id: string;
  name: string;
  languages: string[];
  phone: string;
  email: string;
  password: string;
  licenseNumber?: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

import { useEffect } from "react";
import Dashboard from "../(components)/AdminDashboard/AdminDashboard";
import { useAdminDataContext } from "../(context)/adminContext";
import { useSession } from "next-auth/react";

export default function Admin() {
  //Session part
  const { data: session } = useSession();

  //Fetch the instructor Data
  const { allInstructorData, updateAllInstructorData, updateLoginedInstructorData } = useAdminDataContext();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use relative URL instead of hardcoded localhost and port
        const res = await fetch("/api/instructors", {
          cache: "no-store",
        });
        
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        
        const data: Instructor[] = await res.json();
        updateAllInstructorData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  //Manejo de la sesión del instructor
  useEffect(() => {
    if (session?.user?.email && allInstructorData && allInstructorData.length > 0) {
      // Como allInstructorData es de tipo InstructorData[] pero necesitamos email que está en Instructor
      // Necesitamos hacer un cast o asumir que los datos tienen la estructura completa
      const instructorsWithEmail = allInstructorData as unknown as Instructor[]      
      
      // Buscar el instructor por email
      const instructor = instructorsWithEmail.find(inst => inst.email === session.user?.email);
      console.log("Instructor found:", instructor);
      
      if (instructor) {
        // Solo necesitamos guardar id y nombre para la sesión
        const instructorData = {
          id: instructor.id,
          name: instructor.name
        };
        
        console.log("Instructor found, saving session:", instructorData);
        updateLoginedInstructorData(instructorData);
      } else if (session.user.email) {
        console.warn("No instructor found with email:", session.user.email);
      }
    }
  }, [allInstructorData, session, updateLoginedInstructorData])

  return (
    <div>
      <Dashboard/>
    </div>
  );
}