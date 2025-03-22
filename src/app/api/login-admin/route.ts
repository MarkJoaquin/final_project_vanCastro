import { hashCompare, hashPassword } from "@/lib/hashPass";
import { NextResponse, NextRequest } from "next/server";

const admin = [
  { id: 1, adminName: "admin1", email:"email1", password:"pass" },
  { id: 2, adminName: "admin2", email:"email2", password:"pass" },
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
    console.log("this is hashCompare",await hashCompare(body.password,hashedPassword))
    
    return NextResponse.json({
      message: "post admin",
      email: body.email,
      password: hashedPassword,
    });
  } catch (error) {
    console.error("Error sending admin info:", error);
    return NextResponse.json({ success: false, error: "Failed to login" });
  }
}
