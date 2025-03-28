"use client"
import AdminSetting from "@/app/(components)/AdminDashboard/AdminSetting";
import { useAdminDataContext } from "@/app/(context)/adminContext";

export default function Setting() {
  const {instructorData, isEdit} = useAdminDataContext();

  console.log("InstructorData", instructorData)

  return (
    <div className="h-[70vh]">
      This is Setting
      {instructorData?
      <AdminSetting/>:
      <>Prease try again from Login,,,</>
      }
    </div>
  );
}
