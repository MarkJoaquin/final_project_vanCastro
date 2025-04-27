"use client"

import AvailabilitySettings from "@/app/(components)/AdminDashboard/Settings/AvailabilitySettings"
import InstructorSetting from "../[id]/page"
import useInitialPassStore from "@/store/initialPass"
import { useEffect, useRef } from "react";

export default function SettingsPage() {
    const {isInitialPass, changeIsInitialPassStatus} = useInitialPassStore();
    const hasRun = useRef(false);

    useEffect(()=>{
        if(isInitialPass && !hasRun.current){
            changeIsInitialPassStatus(false)
            alert(`Your Password is same as email,\n Please change your Password!!`)
            hasRun.current = true;
        }

    },[])

    return (
        <div className="min-h-screen p-4">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>
                
                <AvailabilitySettings />
                <InstructorSetting/>
                
                {/* Aquí se pueden agregar más secciones de configuración en el futuro */}
            </div>
        </div>
    )
}
