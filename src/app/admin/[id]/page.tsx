"use client"
import AdminSetting from "@/app/(components)/AdminDashboard/AdminSetting";
import { useAdminDataContext } from "@/app/(context)/adminContext";

export default function InstructorSetting() {
  const {allInstructorData} = useAdminDataContext();

  console.log("InstructorData", allInstructorData)

  return (
    <>
      {allInstructorData?
      <AdminSetting/>:
      <>Prease try again from Login,,,</>
      }
    </>
  );
}
