import { getServerSession } from "next-auth";
import AdminLogin from "../(components)/AdminDashboard/AdminLogin";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { User } from "../user";
import { LoginBtn, LogoutBtn } from "@/components/ui/LoginLogoutBtn";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
//import { Button } from "@/components/ui/button";
//import { signIn, signOut } from "next-auth/react";

export default async function admin() {
  const session = await getServerSession(authOptions)

  if(!session){
    redirect('/auth')
  }

  return (
      <div className="h-[100vh] pt-40">
          <h1>This is the admin page</h1>
          <LogoutBtn/>
          <h2>Server Session</h2>
          <pre>{JSON.stringify(session.user?.name)}</pre>
          <pre>{JSON.stringify(session.user?.email)}</pre>
      </div>
  )
}