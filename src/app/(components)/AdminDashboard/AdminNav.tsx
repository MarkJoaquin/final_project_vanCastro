"use client"

import Image from "next/image"
import Setting from "@/../public/images/Admin/Setting_100_100.png"
import { LogoutBtn } from "@/components/ui/LoginLogoutBtn"
import Link from "next/link"
import { useAdminDataContext } from "@/app/(context)/adminContext"
import { User } from "lucide-react"

export default function AdminNav(){
  const { loginedInstructorData } = useAdminDataContext();

  return (
    <nav className="w-full h-16 bg-white shadow-sm fixed top-0 left-0 lg:static z-20 px-4 lg:px-8">
      <div className="h-full flex justify-between items-center">
        {/* Logo/Dashboard link - visible on all screens */}
        <Link href="/admin" className="flex items-center">
          <p className="text-sm md:text-base font-medium hover:underline">Dashboard</p>
        </Link>

        {/* Instructor info - hidden on small screens */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">{loginedInstructorData?.name || 'Instructor'}</p>
            <p className="text-xs text-gray-500">Instructor</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Profile icon - visible on all screens */}
          <Link 
            href={`/admin/${loginedInstructorData?.id}`}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Profile Settings"
          >
            {/* {loginedInstructorData?.profileImageUrl ? (
              <Image
                src={loginedInstructorData.profileImageUrl}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="h-5 w-5 text-gray-700" />
            )} */}
          </Link>
          
          {/* Settings icon */}
          <Link 
            href={`/admin/settings`}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Image
              src={Setting}
              alt="Settings"
              width={20}
              height={20}
              style={{height:"20px",width:"20px"}}
            />
          </Link>
          
          {/* Logout button */}
          <LogoutBtn />
        </div>
      </div>
    </nav>
  )
}