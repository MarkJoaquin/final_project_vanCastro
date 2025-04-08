"use client"
import AdminSetting from "@/app/(components)/AdminDashboard/AdminSetting";
import { useAdminDataContext } from "@/app/(context)/adminContext";

export default function Setting() {
  const {allInstructorData} = useAdminDataContext();

  console.log("InstructorData", allInstructorData)

  return (
    <div className="h-[70vh]">
      <h3 className="font-bold">This Is Setting page, Sho is creating</h3>
      {allInstructorData?
      <AdminSetting/>:
      <>Prease try again from Login,,,</>
      }
    </div>
  );
}
