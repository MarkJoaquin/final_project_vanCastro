"use client"

import Image from "next/image"
import Setting from "@/../public/images/Admin/Setting_100_100.png"
import { LogoutBtn } from "@/components/ui/LoginLogoutBtn"

export default function AdminNav(){

  return <>
    <div className="h-[128px] bg-[#14120C]">
    </div>
    <div className="w-[100%] h-[60px] flex justify-end items-center gap-[1rem] border-b-2 border-blue-100 pl-[2rem] pr-[2rem]">
      <Image
        src={Setting}
        alt="setting"
        height={100}
        width={100}
        style={{height:"30px",width:"30px"}}
      />
      <LogoutBtn/>
    </div>
  </>
}