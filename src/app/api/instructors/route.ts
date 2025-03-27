import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//GET
export async function GET(){
  try {
    const InstructorData = await prisma.instructor.findMany();
    return NextResponse.json(InstructorData);
  } catch (error) {
    console.error("Error getting Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to get Instructor Info" },{status:500});
  }
}

/* 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json({ message: "Missing title or content" });
    }

    const newUser = await prisma.instructor.create({
      data: {
        email: body.email,
      },
    });

    return NextResponse.json({
      message: "Post Added successfully",
      post: newUser,
    });
  } catch (error) {
    console.error("Error getting Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to getting Instructor Info" });
  }
}
 */