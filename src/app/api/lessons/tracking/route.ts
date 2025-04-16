import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Primero buscamos en la tabla Lesson (tiene prioridad)
    const lesson = await prisma.lesson.findFirst({
      where: {
        trackingNumber: trackingNumber,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
            address: true,
            city: true,
          },
        },
      },
    });

    // Si encontramos la lección, devolvemos esa información
    if (lesson) {
      // Ajustar las horas a la zona horaria de Vancouver (PDT, UTC-7)
      // Primero, extraemos las horas y minutos de startTime y endTime
      const [startHours, startMinutes] = lesson.startTime.split(':').map(Number);
      const [endHours, endMinutes] = lesson.endTime.split(':').map(Number);
      
      // No necesitamos ajustar nada aquí, ya que las horas ya fueron ajustadas al guardarlas
      // Simplemente formateamos las horas para mostrarlas
      const adjustedStartTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      const adjustedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Ajustar la fecha para corregir el problema del día menos
      // Convertimos la fecha a un objeto Date y ajustamos para la zona horaria de Vancouver
      const lessonDate = new Date(lesson.date);
      // Sumamos un día para corregir el problema
      lessonDate.setDate(lessonDate.getDate() + 1);
      
      return NextResponse.json({
        found: true,
        type: 'lesson',
        data: {
          id: lesson.id,
          studentName: lesson.student.name,
          instructorName: lesson.instructor.name,
          date: lessonDate,
          startTime: adjustedStartTime,
          endTime: adjustedEndTime,
          duration: lesson.duration,
          location: `${lesson.location.name}, ${lesson.location.address}, ${lesson.location.city}`,
          plan: lesson.plan,
          price: lesson.price,
          licenseClass: lesson.licenseClass,
          status: lesson.status,
          paymentStatus: lesson.paymentStatus,
          paymentMethod: lesson.paymentMethod || 'Not specified',
          trackingNumber: lesson.trackingNumber,
          createdAt: lesson.createdAt,
        },
      });
    }

    // Si no encontramos en Lesson, buscamos en LessonsRequest
    const lessonRequest = await prisma.lessonsRequest.findFirst({
      where: {
        trackingNumber: trackingNumber,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
            address: true,
            city: true,
          },
        },
      },
    });

    if (lessonRequest) {
      // Ajustar las horas a la zona horaria de Vancouver (PDT, UTC-7)
      // Primero, extraemos las horas y minutos de startTime y endTime
      const [startHours, startMinutes] = lessonRequest.startTime.split(':').map(Number);
      const [endHours, endMinutes] = lessonRequest.endTime.split(':').map(Number);
      
      // No necesitamos ajustar nada aquí, ya que las horas ya fueron ajustadas al guardarlas
      // Simplemente formateamos las horas para mostrarlas
      const adjustedStartTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      const adjustedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Ajustar la fecha para corregir el problema del día menos
      // Convertimos la fecha a un objeto Date y ajustamos para la zona horaria de Vancouver
      const requestDate = new Date(lessonRequest.lessonDate);
      // Sumamos un día para corregir el problema
      requestDate.setDate(requestDate.getDate() + 1);
      
      return NextResponse.json({
        found: true,
        type: 'request',
        data: {
          id: lessonRequest.id,
          studentName: lessonRequest.student.name,
          instructorName: lessonRequest.instructor.name,
          date: requestDate,
          startTime: adjustedStartTime,
          endTime: adjustedEndTime,
          duration: lessonRequest.lessonDuration,
          location: `${lessonRequest.location.name}, ${lessonRequest.location.address}, ${lessonRequest.location.city}`,
          plan: lessonRequest.lessonPlan,
          price: lessonRequest.lessonPrice,
          licenseClass: lessonRequest.licenseClass,
          status: lessonRequest.lessonStatus,
          paymentMethod: lessonRequest.paymentMethod || 'Not specified',
          trackingNumber: lessonRequest.trackingNumber,
          createdAt: lessonRequest.createdAt,
        },
      });
    }

    // Si no encontramos en ninguna tabla
    return NextResponse.json(
      { found: false, error: 'No booking found with this tracking number' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching booking by tracking number:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking information' },
      { status: 500 }
    );
  }
}
