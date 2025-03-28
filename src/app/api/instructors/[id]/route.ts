import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();

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