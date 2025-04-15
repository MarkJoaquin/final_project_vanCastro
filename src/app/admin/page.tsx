"use client";
import 'react-big-calendar/lib/css/react-big-calendar.css'


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
        const res = await fetch("http://localhost:3000/api/instructors", {
          cache: "default",
        });
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
      {allInstructorData?.map((item,index)=> <div key={index}>
          <p>InstructorID: {item.id}</p>
        </div>)}
      <Dashboard/>
    </div>
  );
}