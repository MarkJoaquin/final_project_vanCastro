import { hashCompare, hashPassword } from "@/lib/hashPass";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if( !id ){
    return NextResponse.json(
      { status: "error", message: "Instructor ID is required" },
      { status: 400 }
    );
  }

  try {
    const InstructorData = await prisma.instructor.findUnique({
      where:{
        id: id
      },
    });

    console.log("FindUnique",InstructorData)

    return NextResponse.json({
      status: "success",
      data: InstructorData,
    });
  } catch (error) {
    console.error("Error updating Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to get Instructor Info" });
  }
}

export async function PUT(request: NextRequest) {
  const id  = request.nextUrl.pathname.split("/").pop();
  const body = await request.json();

  if( !id ){
    return NextResponse.json(
      { status: "error", message: "Instructor ID is required" },
      { status: 400 }
    );
  }

  const instructor = await prisma.instructor.findUnique({
    where: {
      id: id
    }
  })

  if(!instructor){
    return NextResponse.json(
      { status: "error", message: "Instructer ID info has error. Please try again after logout" },
      { status: 400 }
    );
  }

  const isPasswordValid =  await hashCompare(body.currentPassword,instructor.password)

  if(!isPasswordValid){
    console.log("Your Current Password is worng,,,")
    return NextResponse.json(
      { status: "error", message: "Your Current Password is worng,,," },
      { status: 400 }
    );
  }
  
  const hashedPassword = await hashPassword(body.newPassword)
  
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
        password: hashedPassword,
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

export async function DELETE(request:NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if( !id ){
    return NextResponse.json(
      { status: "error", message: "Instructor ID is required" },
      { status: 400 }
    );
  }

  try {
    const deleteInstructor = await prisma.instructor.delete({
      where:{
        id: id,
      }
    });

    return NextResponse.json({
      status: "success",
      data: deleteInstructor,
    });
  } catch (error) {
    console.error("Error deleting Instructor Info:", error);
    return NextResponse.json({ success: false, error: "Failed to delete Instructor Info" });
  }
}