"use client";

import { createContext, useContext, useState, useCallback } from "react";

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
  allInstructorData: Instructor[] | null;
  loginedInstructorData: Instructor | null;
  updateAllInstructorData: (data: Instructor[]) => void;
  updateLoginedInstructorData: (email: string | null) => void;
};

const AdminDataContext = createContext<State | undefined>(undefined);

const AdminDataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allInstructorData, setAllInstructorData] = useState<Instructor[] | null>(null);
  const [loginedInstructorData, setLoginedInstructorData] = useState<Instructor | null>(null);

  const updateAllInstructorData = useCallback((value: Instructor[]) => {
    setAllInstructorData(value);
  }, []);

  const updateLoginedInstructorData = useCallback((email: string | null) => {
    if (allInstructorData) {
      const checkInstructor =
        allInstructorData.find((instructor) => instructor.email === email) || null;
      setLoginedInstructorData(checkInstructor);
    }
  }, [allInstructorData]);

  const value = { allInstructorData, loginedInstructorData, updateAllInstructorData, updateLoginedInstructorData };

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
};

const useAdminDataContext = (): State => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminDataContext must be used within a AdminDataContextProvider");
  }
  return context;
};

export { AdminDataContextProvider, useAdminDataContext };