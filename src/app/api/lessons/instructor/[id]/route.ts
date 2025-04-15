import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params antes de acceder a sus propiedades (requisito de Next.js 14+)
    const resolvedParams = await params;
    const instructorId = resolvedParams.id;
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!instructorId) {
      return NextResponse.json(
        { error: 'Instructor ID is required' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Convertir la fecha de string a objeto Date para comparar con el campo date
    const searchDate = new Date(date);
    // Establecer la hora a 00:00:00 para comparar solo la fecha
    searchDate.setHours(0, 0, 0, 0);
    
    // Obtener todas las lecciones confirmadas del instructor para la fecha especificada
    const confirmedLessons = await prisma.lesson.findMany({
      where: {
        instructorId,
        date: {
          equals: searchDate
        },
        status: 'CONFIRMED',
      },
      select: {
        id: true,
        date: true,
        startTime: true,  // Nombre correcto según el esquema
        duration: true,   // Nombre correcto según el esquema
        locationId: true,
      },
    });

    // Obtener todas las solicitudes de lecciones pendientes para el instructor en la fecha especificada
    const pendingRequests = await prisma.lessonsRequest.findMany({
      where: {
        instructorId,
        lessonDate: {
          equals: searchDate
        },
        lessonStatus: 'REQUESTED',
      },
      select: {
        id: true,
        lessonDate: true,
        startTime: true,     // Nombre correcto según el esquema
        lessonDuration: true,
        lessonLocation: true,
      },
    });

    // Transformar los datos para tener un formato consistente
    const formattedConfirmedLessons = confirmedLessons.map(lesson => ({
      id: lesson.id,
      lessonDate: lesson.date,
      lessonTime: lesson.startTime,
      lessonDuration: lesson.duration,
      locationId: lesson.locationId
    }));

    const formattedPendingRequests = pendingRequests.map(request => ({
      id: request.id,
      lessonDate: request.lessonDate,
      lessonTime: request.startTime,
      lessonDuration: request.lessonDuration,
      locationId: request.lessonLocation
    }));

    // Combinar ambas listas para obtener todos los horarios ocupados
    const allLessons = [...formattedConfirmedLessons, ...formattedPendingRequests];

    return NextResponse.json({ lessons: allLessons });
  } catch (error) {
    console.error('Error fetching instructor lessons:', error);
    return NextResponse.json(
      { error: 'Error fetching instructor lessons' },
      { status: 500 }
    );
  }
}
