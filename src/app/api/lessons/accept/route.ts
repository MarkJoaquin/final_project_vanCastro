import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: 'Lesson request ID is required' },
        { status: 400 }
      );
    }

    // Obtener los detalles de la solicitud
    const lessonRequest = await prisma.lessonsRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lessonRequest) {
      return NextResponse.json(
        { error: 'Lesson request not found' },
        { status: 404 }
      );
    }

    // Verificar que la solicitud esté en estado REQUESTED
    if (lessonRequest.lessonStatus !== 'REQUESTED') {
      return NextResponse.json(
        { error: 'Only lesson requests with status REQUESTED can be accepted' },
        { status: 400 }
      );
    }

    // Crear una transacción para actualizar la solicitud y crear la lección
    const result = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el estado de la solicitud a CONFIRMED
      const updatedRequest = await tx.lessonsRequest.update({
        where: { id: requestId },
        data: {
          lessonStatus: 'CONFIRMED',
          updatedAt: new Date(),
        },
      });

      // 2. Crear una nueva entrada en la tabla lesson
      // Preparamos los datos para crear la lección
      // Aseguramos que la fecha se maneje correctamente para la zona horaria de Vancouver
      
      // Convertimos la fecha a formato ISO y extraemos solo la parte de la fecha (YYYY-MM-DD)
      // para evitar problemas con zonas horarias
      let lessonDate;
      if (lessonRequest.lessonDate instanceof Date) {
        const dateStr = lessonRequest.lessonDate.toISOString().split('T')[0];
        lessonDate = new Date(dateStr + 'T00:00:00.000Z');
      } else {
        // Si ya es un string o algún otro formato, intentamos convertirlo
        const dateObj = new Date(lessonRequest.lessonDate);
        const dateStr = dateObj.toISOString().split('T')[0];
        lessonDate = new Date(dateStr + 'T00:00:00.000Z');
      }
      
      const lessonData: any = {
        studentId: lessonRequest.studentId,
        instructorId: lessonRequest.instructorId,
        date: lessonDate,
        startTime: lessonRequest.startTime,
        endTime: lessonRequest.endTime,
        duration: lessonRequest.lessonDuration,
        plan: lessonRequest.lessonPlan,
        price: lessonRequest.lessonPrice,
        status: 'CONFIRMED',
        paymentStatus: 'PAID', // Asumimos que está pagado, pero podría ser configurable
        // Según el esquema, licenseClass es obligatorio
        licenseClass: lessonRequest.licenseClass || '', // Valor por defecto si no existe
        trackingNumber: lessonRequest.trackingNumber,
        locationId: lessonRequest.lessonLocation,
      };

      // paymentMethod es opcional, solo lo incluimos si existe
      if (lessonRequest.paymentMethod) {
        lessonData.paymentMethod = lessonRequest.paymentMethod;
      }

      const lesson = await tx.lesson.create({
        data: lessonData,
      });

      return { updatedRequest, lesson };
    });

    return NextResponse.json({
      success: true,
      message: 'Lesson request accepted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error accepting lesson request:', error);
    return NextResponse.json(
      { error: 'Failed to accept lesson request' },
      { status: 500 }
    );
  }
}
