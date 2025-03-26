import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { LogoutBtn } from "@/components/ui/LoginLogoutBtn";
import { redirect } from "next/navigation";
import Setting from "@/../public/images/Admin/Setting_100_100.png"
import Image from "next/image";

export default async function admin() {
  const session = await getServerSession(authOptions)
  if(!session){
    redirect('/auth')
  }

  const settingHandler = ()=>{
    console.log("Hello Setting")
  }

  return (
      <div >
        <h1>This is the admin page</h1>
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session.user?.name)}</pre>
        <pre>{JSON.stringify(session.user?.email)}</pre>
      </div>
  )
}