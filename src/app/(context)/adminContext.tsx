"use client"

import { createContext, useContext, useState } from "react";

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

type State = {
  instructorData: Instructor[] | null;
  isEdit: number | false;
  updateInstructorData: (data:Instructor[])=>void;
  openEdit: (value:number|false)=>void;
}

const AdminDataContext = createContext<State | undefined>(undefined); 

const AdminDataContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [instructorData, setInstructorData] = useState<Instructor[] | null>(null);
  const [isEdit,setIsEdit] = useState<number|false>(false);

  const updateInstructorData = (value:Instructor[]) => {
    setInstructorData(value);
  };
  const openEdit = (value:number|false)=>{
    setIsEdit(value);
  }

  const value = { instructorData,isEdit, updateInstructorData, openEdit};

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

const useAdminDataContext = ():State => {
  const context = useContext(AdminDataContext);
  if(!context){
    throw new Error("useAdminDataContext must be used within a CounterContextProvider");
  }
  return context;
}

export { AdminDataContextProvider, useAdminDataContext };