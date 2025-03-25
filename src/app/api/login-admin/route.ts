import { hashCompare, hashPassword } from "@/lib/hashPass";
import { NextResponse, NextRequest } from "next/server";

const admin = [
  { id: 1, name: "admin1", languages:["English"], phone:"12345", email:"email1@123", password:"email1@123" },
  { id: 2, name: "admin2", languages:["English"], phone:"12345", email:"email2@234", password:"email2@234" },
];

export async function GET() {
  try {
    console.log("Admin Get");
    return NextResponse.json(admin);
  } catch (error) {
    console.error("Error getting admin info:", error);
    return NextResponse.json({ success: false, error: "Failed to getting admin Info" });
  }
}

export async function POST(request: Request) {
  try {
    console.log("Admin Post");
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ message: "Missing admin" });
    }
    
    const hashedPassword = await hashPassword(body.password)

    //check all admin info
    const findAdmin = admin.find((data)=>{
      return data.email === body.email
    })

    if(findAdmin && await hashCompare(findAdmin.email,hashedPassword)){
      console.log("FindAdmin",findAdmin)
      return NextResponse.redirect(`/admin/Dashboard`)
    } else {
      return NextResponse.redirect(`/admin`)
    }
/* 
    return NextResponse.json({
      message: "post admin",
      email: body.email,
      password: hashedPassword,
    });
 */  } catch (error) {
    console.error("Error sending admin info:", error);
    return NextResponse.json({ success: false, error: "Failed to login" });
  }
}
