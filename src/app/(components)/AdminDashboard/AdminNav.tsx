"use client"

import Image from "next/image"
import Setting from "@/../public/images/Admin/Setting_100_100.png"
import { LogoutBtn } from "@/components/ui/LoginLogoutBtn"
import Link from "next/link"

export default function AdminNav(){

  return <>
    <div className="h-[128px] bg-[#14120C]">
    </div>
    <div className="w-[100%] h-[60px] flex justify-between items-center gap-[1rem] border-b-2 border-blue-100 pl-[2rem] pr-[2rem]">
      <Link href="/admin">
        <p className="underline">Dashboard</p>
      </Link>
      <div className="flex gap-[1rem] items-center">
        <Link href="/admin/setting">
          <Image
            src={Setting}
            alt="setting"
            height={100}
            width={100}
            style={{height:"30px",width:"30px"}}
          />
        </Link>
        <LogoutBtn/>
      </div>
    </div>
  </>
}