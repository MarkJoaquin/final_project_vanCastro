"use client";

import { createContext, useContext, useState } from "react";


type State = {
  isInitialPass:boolean;
  changeIsInitialPassStatus:(value:boolean)=>void
};

const InitialPassContext = createContext<State | null>(null);

const InitialPassContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialPass, setIsInitialPass] = useState<boolean>(false);

  const changeIsInitialPassStatus = (value:boolean)=>{
    setIsInitialPass(value)
  }

  const value = { isInitialPass, changeIsInitialPassStatus };

  return <InitialPassContext.Provider value={value}>{children}</InitialPassContext.Provider>;
};

const useInitialPassContext = (): State => {
  const context = useContext(InitialPassContext);
  if (!context) {
    throw new Error("useInitialPassContext must be used within a InitialPassContextProvider");
  }
  return context;
};

export { InitialPassContextProvider, useInitialPassContext };