import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if(!session){
    return new NextResponse(JSON.stringify({error:"unauthorized"}),{status:401})
  }

  console.log("GET API", session)
  return NextResponse.json({authenticated: !!session})
}