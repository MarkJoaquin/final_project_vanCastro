import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(){
  try {
    const InstructorData = await prisma.instructor.findMany();
    return NextResponse.json(InstructorData);
  } catch (error) {
    console.error("Error getting Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to get Instructor Info" },{status:500});
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.name || !body.languages || !body.phone || !body.password) {
      return NextResponse.json({ message: "Missing information" });
    }
/* 
    model Instructor {
      id             String           @id @default(auto()) @map("_id") @db.ObjectId
      name           String
      languages      String[]
      phone          String
      email          String           @unique
      password       String
      licenseNumber  String?
      experienceYears Int?
    }
 */
    const newInstructor = await prisma.instructor.create({
      data: {
        email: body.email as string,
        name: body.name as string,
        languages: body.languages as string[],
        phone: body.phone as string,
        password: body.password as string,
        ...(body.licenseNumber && { licenseNumber: body.licenseNumber as string }),
        ...(body.experienceYears && {experienceYears:body.experienceYears as number})
      },
    });

    return NextResponse.json({
      message: "Post Added successfully",
      post: newInstructor,
    });
  } catch (error) {
    console.error("Error adding new Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to add Instructor Info" });
  }
}
