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

import { useEffect, useState } from "react";
import Dashboard from "../(components)/AdminDashboard/AdminDashboard";
import { useAdminDataContext } from "../(context)/adminContext";

export default function Admin() {
  //Fetch the instructor Data
  const {instructorData, updateInstructorData } = useAdminDataContext();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/instructors", {
          cache: "no-store",
        });
        const data: Instructor[] = await res.json();
        updateInstructorData(data);
//        setInstructorLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
//        setInstructorLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <Dashboard/>
{/*       {instructorLoading? <h3 className="text-center">Loading,,,</h3>: 
        <AdminSetting instructorData={instructorData}/>
      } */}
    </div>
  );
}