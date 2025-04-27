"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

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

interface InstructorData {
  id: string;
  name: string;
}

type State = {
  allInstructorData: InstructorData[];
  loginedInstructorData: InstructorData | null;
  bookingRequestCount: number;
  updateAllInstructorData: (data: InstructorData[]) => void;
  updateLoginedInstructorData: (data: InstructorData | null) => void;
  updateBookingRequestCount: (newCount: number) => void;
  logout: () => void;
};

const AdminDataContext = createContext<State | null>(null);

// Clave para almacenar la sesión en localStorage
const SESSION_STORAGE_KEY = "instructor_session";

const AdminDataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allInstructorData, setAllInstructorData] = useState<InstructorData[]>([]);
  const [loginedInstructorData, setLoginedInstructorData] = useState<InstructorData | null>(null);
  const [bookingRequestCount, setBookingRequestCount] = useState<number>(0); // Nuevo estado para el contador

  // Intentar restaurar la sesión al cargar el componente
  useEffect(() => {
    // Solo se ejecuta en el cliente, no en el servidor
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession);
          setLoginedInstructorData(parsedSession);
        } catch (error) {
          console.error("Error parsing saved session:", error);
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    }
  }, []);

  const updateBookingRequestCount = useCallback((newCount: number) => {
    setBookingRequestCount(newCount);
  }, []);

  const updateAllInstructorData = useCallback((data: InstructorData[]) => {
    setAllInstructorData(data);
  }, []);

  const updateLoginedInstructorData = useCallback((data: InstructorData | null) => {
    setLoginedInstructorData(data);
    
    // Guardar la sesión en localStorage cuando inicie sesión un instructor
    if (data) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  // Función para cerrar sesión
  const logout = useCallback(() => {
    setLoginedInstructorData(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (allInstructorData.length > 0) {
      console.log("I fired", allInstructorData);
    }
  }, [allInstructorData]);

  const value = {
    allInstructorData,
    loginedInstructorData,
    bookingRequestCount, // Incluye el contador en el contexto
    updateAllInstructorData,
    updateLoginedInstructorData,
    updateBookingRequestCount, // Incluye la función de actualización
    logout,
  };

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