"use client"
import { createContext, useContext, useState } from "react";

type State = {
  activeBtn:string|null;
  setActive:(btnName:string)=>void
}

const SelectBtnContext = createContext<State | undefined>(undefined); //STEP 1. Declare Context

//STEP 2. Create Provider
const SelectBtnContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [activeBtn,setActiveBtn] = useState<string|null>(null);
  const setActive = (btnName:string) => {
    setActiveBtn(btnName)
  }

  const value = {activeBtn,setActive};

  return (
    <SelectBtnContext.Provider value={value}>
      {children}
    </SelectBtnContext.Provider>
  )
}

const useSelectBtnContext = ():State => {
  const context = useContext(SelectBtnContext);
  if(!context){
    throw new Error("useSelectBtnContex must be used within a CounterContextProvider");
  }
  return context;
}

export { SelectBtnContextProvider, useSelectBtnContext };