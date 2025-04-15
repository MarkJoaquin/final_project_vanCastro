import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const instructorId = url.searchParams.get("instructorId");

    if (instructorId) {
      // Buscar estudiantes que tengan lecciones con este instructor
      const studentsWithLessons = await prisma.student.findMany({
        where: {
          lessons: {
            some: {
              instructorId: instructorId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      // Buscar estudiantes que tengan solicitudes de lecciones con este instructor
      const studentsWithRequests = await prisma.student.findMany({
        where: {
          lessonRequests: {
            some: {
              instructorId: instructorId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      // Combinar y eliminar duplicados
      const allStudents = [...studentsWithLessons, ...studentsWithRequests];
      const uniqueStudents = [...new Map(allStudents.map(student => [student.id, student])).values()];

      return NextResponse.json(uniqueStudents);
    } else {
      // Si no se especifica instructorId, devolver todos los estudiantes
      const allStudents = await prisma.student.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      
      return NextResponse.json(allStudents);
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Error fetching students" },
      { status: 500 }
    );
  }
}
