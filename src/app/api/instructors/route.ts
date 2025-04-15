import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(){
  try {
    // Check if Prisma client is properly initialized
    if (!prisma) {
      throw new Error('Prisma client is not initialized');
    }
    
    const InstructorData = await prisma.instructor.findMany();
    return NextResponse.json(InstructorData);
  } catch (error) {
    console.error("Error getting Instructor Info:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get Instructor Info", 
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.name || !body.languages || !body.phone || !body.password) {
      return NextResponse.json({ message: "Missing information" });
    }
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();

  console.log(id)

  if( !id ){
    return NextResponse.json(
      { status: "error", message: "Instructor ID is required" },
      { status: 400 }
    );
  }

  try {
    const updateInstructor = await prisma.instructor.update({
      where:{
        id: id,
      },
      data:{
        name: body.name,
        languages: body.languages,
        phone: body.phone,
        email: body.email,
        password: body.password,
        ...(body.licenseNumber && { licenseNumber: body.licenseNumber as string }),
        ...(body.experienceYears && {experienceYears:body.experienceYears as number})
      }
    });

    return NextResponse.json({
      status: "success",
      data: updateInstructor,
    });
  } catch (error) {
    console.error("Error updating Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to update Instructor Info" });
  }
}