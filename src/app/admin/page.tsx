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
  const { allInstructorData,updateAllInstructorData, updateLoginedInstructorData } = useAdminDataContext();
  
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

  //This is for setting part. It doesn't relate with login part.
  //The data is null, Sho is fixing this part
  useEffect(()=>{
    if(session){
      const loginedData = JSON.stringify(session.user?.email);
      console.log("HEREEEEEE",loginedData)
      //-> got session email address...
            
      updateLoginedInstructorData(session?.user?.email||null)
    }
  },[allInstructorData])

  return (
    <div>
      <Dashboard/>
    </div>
  );
}