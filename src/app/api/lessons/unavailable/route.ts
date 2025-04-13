import { NextRequest, NextResponse } from 'next/server';
import { getUnavailableTimeSlots } from '@/lib/lessonValidations';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const instructorId = searchParams.get('instructorId');
    const date = searchParams.get('date');

    if (!instructorId || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Parse the date to match database format
    const queryDate = new Date(date);
    
    // Create start and end of day for range query
    const year = queryDate.getFullYear();
    const month = queryDate.getMonth();
    const day = queryDate.getDate();
    const startOfDay = new Date(year, month, day);
    const endOfDay = new Date(year, month, day, 23, 59, 59);

    console.log('Rango de consulta:', {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString()
    });
    
    console.log('Consultando slots no disponibles para:', {
      instructorId,
      date: queryDate.toISOString(),
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });

    // Get confirmed lessons for the instructor on the specified date
    const confirmedLessons = await prisma.lesson.findMany({
      where: {
        instructorId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        id: true,
        instructorId: true,
        date: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        plan: true, // Incluimos el plan para obtener la duración
        instructor: {
          select: {
            name: true
          }
        }
      },
    });

    console.log('Lecciones confirmadas encontradas:', JSON.stringify(confirmedLessons, null, 2));

    // Get pending lesson requests for the instructor on the specified date
    const pendingRequests = await prisma.lessonsRequest.findMany({
      where: {
        instructorId,
        lessonDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        lessonStatus: {
          notIn: ['REJECTED', 'LATE_RESPONSE'],
        },
      },
      select: {
        id: true,
        instructorId: true,
        lessonDate: true,
        startTime: true,
        endTime: true,
        lessonDuration: true,
        lessonStatus: true,
        instructor: {
          select: {
            name: true
          }
        }
      },
    });

    console.log('Solicitudes pendientes encontradas:', JSON.stringify(pendingRequests, null, 2));

    // Si no hay lecciones o solicitudes, verificar si hay lecciones para John Doe el 15 de abril
    /* if (confirmedLessons.length === 0 && pendingRequests.length === 0) {
      const instructor = await prisma.instructor.findUnique({
        where: { id: instructorId },
        select: { name: true }
      });
      
      const instructorName = instructor?.name || '';
      const dateStr = queryDate.toISOString().split('T')[0];
      
      // Si es John Doe y es el 15 de abril, añadir una lección manualmente
      if (instructorName.toLowerCase().includes('john doe') && dateStr === '2025-04-15') {
        console.log('Añadiendo lección especial para John Doe el 15 de abril');
        confirmedLessons.push({
          id: 'special-lesson',
          instructorId,
          date: queryDate,
          startTime: '10:00',
          endTime: '11:00',
          duration: '60',
          status: 'CONFIRMED',
          plan: '60 Min Lesson',
          instructor: { name: instructorName }
        });
      }
    } */

    // Format the data to return unavailable time slots
    const unavailableSlots = [
      ...confirmedLessons.map(lesson => {
        // Calcular hora de finalización basada en duración si es necesario
        let endTime = lesson.endTime;
        if (!endTime && lesson.startTime && lesson.duration) {
          const [hours, minutes] = lesson.startTime.split(':').map(Number);
          const durationMinutes = parseInt(String(lesson.duration), 10);
          
          const startDateTime = new Date(queryDate);
          startDateTime.setHours(hours, minutes, 0, 0);
          
          const endDateTime = new Date(startDateTime);
          endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);
          
          endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;
        }
        
        return {
          id: lesson.id,
          instructorName: lesson.instructor?.name || 'Unknown',
          startTime: lesson.startTime,
          endTime: endTime || lesson.startTime, // Fallback por si no hay endTime
          date: lesson.date.toISOString(),
          status: lesson.status,
          duration: lesson.duration,
          type: 'confirmed_lesson'
        };
      }),
      ...pendingRequests.map(request => {
        // Calculate end time based on start time and duration
        const [hours, minutes] = request.startTime.split(':').map(Number);
        const durationMinutes = parseInt(request.lessonDuration, 10);
        
        const startDateTime = new Date(request.lessonDate);
        startDateTime.setHours(hours, minutes, 0, 0);
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);
        
        const endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;
        
        return {
          id: request.id,
          instructorName: request.instructor?.name || 'Unknown',
          startTime: request.startTime,
          endTime: endTime,
          date: request.lessonDate.toISOString(),
          status: request.lessonStatus,
          duration: request.lessonDuration,
          type: 'pending_request'
        };
      }),
    ];

    console.log('Slots no disponibles:', JSON.stringify(unavailableSlots, null, 2));

    return NextResponse.json(unavailableSlots);
  } catch (error) {
    console.error('Error fetching unavailable time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unavailable time slots' },
      { status: 500 }
    );
  }
}
