import prisma from './prisma';

/**
 * Validates if an instructor is available for a specific time slot
 * Checks both confirmed lessons and pending requests
 * @param instructorId - The ID of the instructor
 * @param lessonDate - The date of the lesson
 * @param lessonTime - The start time of the lesson (format: "HH:MM")
 * @param duration - The duration of the lesson in minutes
 * @returns An object with validation result and error message if applicable
 */
export async function validateInstructorAvailability(
  instructorId: string,
  lessonDate: Date,
  lessonTime: string,
  duration: number
): Promise<{ isAvailable: boolean; message?: string }> {
  try {
    // Calculate end time based on start time and duration
    const [hours, minutes] = lessonTime.split(':').map(Number);
    const startDateTime = new Date(lessonDate);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);

    const endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;

    // Create start and end of day for range query
    const year = lessonDate.getFullYear();
    const month = lessonDate.getMonth();
    const day = lessonDate.getDate();
    const startOfDay = new Date(year, month, day, 0, 0, 0);
    const endOfDay = new Date(year, month, day, 23, 59, 59);

    // Check for conflicting lessons (excluding cancelled lessons)
    const conflictingLessons = await prisma.lesson.findMany({
      where: {
        instructorId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'CANCELLED',
        },
        AND: [
          {
            OR: [
              // Lesson starts during our requested time
              {
                startTime: {
                  gte: lessonTime,
                  lt: endTime,
                },
              },
              // Lesson ends during our requested time
              {
                endTime: {
                  gt: lessonTime,
                  lte: endTime,
                },
              },
              // Lesson completely encompasses our requested time
              {
                startTime: {
                  lte: lessonTime,
                },
                endTime: {
                  gte: endTime,
                },
              },
            ],
          },
        ],
      },
    });

    // Check for conflicting lesson requests (excluding rejected requests)
    const conflictingRequests = await prisma.lessonsRequest.findMany({
      where: {
        instructorId,
        lessonDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        lessonStatus: {
          not: 'REJECTED',
        },
        AND: [
          {
            OR: [
              // Request starts during our requested time
              {
                startTime: {
                  gte: lessonTime,
                  lt: endTime,
                },
              },
              // Request ends during our requested time
              {
                endTime: {
                  gt: lessonTime,
                  lte: endTime,
                },
              },
              // Request completely overlaps our requested time
              {
                startTime: {
                  lte: lessonTime,
                },
                endTime: {
                  gte: endTime,
                },
              },
            ],
          },
        ],
      },
    });

    // Filter requests that end during our requested time or encompass it
    // (We need to do this manually since we need to calculate end time for each request)
    const actualConflictingRequests = conflictingRequests.filter(request => {
      const [reqHours, reqMinutes] = request.startTime.split(':').map(Number);
      const reqDuration = parseInt(request.lessonDuration, 10);

      const reqStartDateTime = new Date(request.lessonDate);
      reqStartDateTime.setHours(reqHours, reqMinutes, 0, 0);

      const reqEndDateTime = new Date(reqStartDateTime);
      reqEndDateTime.setMinutes(reqEndDateTime.getMinutes() + reqDuration);

      const reqEndTime = `${reqEndDateTime.getHours().toString().padStart(2, '0')}:${reqEndDateTime.getMinutes().toString().padStart(2, '0')}`;

      // Check if request ends during our requested time
      if (reqEndTime > lessonTime && reqEndTime <= endTime) {
        return true;
      }

      // Check if request completely encompasses our requested time
      if (request.startTime <= lessonTime && reqEndTime >= endTime) {
        return true;
      }

      return false;
    });

    // If there are any conflicts, the instructor is not available
    if (conflictingLessons.length > 0 || actualConflictingRequests.length > 0) {
      return {
        isAvailable: false,
        message: 'Instructor is not available at the selected time.',
      };
    }

    return { isAvailable: true };
  } catch (error) {
    console.error('Error validating instructor availability:', error);
    return {
      isAvailable: false,
      message: 'An error occurred while validating instructor availability.',
    };
  }
}

/**
 * Gets all unavailable time slots for an instructor on a specific date
 * @param instructorId - The ID of the instructor
 * @param date - The date to check
 * @returns Array of unavailable time slots with start and end times
 */
export async function getUnavailableTimeSlots(
  instructorId: string,
  date: Date
): Promise<Array<{ id: string; instructorName: string; startTime: string; endTime: string; date: string; status: string; type: string }>> {
  try {
    // Create start and end of day for range query
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startOfDay = new Date(year, month, day, 0, 0, 0);
    const endOfDay = new Date(year, month, day, 23, 59, 59);

    // Log para depuración
    console.log('Buscando slots no disponibles para:', {
      instructorId,
      date: date.toISOString(),
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
        instructor: {
          select: {
            name: true
          }
        }
      },
    });

    // Log de lecciones encontradas para depuración
    console.log('Lecciones confirmadas encontradas:', JSON.stringify(confirmedLessons, null, 2));

    // Si no se encontraron lecciones, verifiquemos todas las lecciones del instructor
    if (confirmedLessons.length === 0) {
      console.log('No se encontraron lecciones para esta fecha, verificando todas las lecciones del instructor');
      const allLessons = await prisma.lesson.findMany({
        where: {
          instructorId,
          status: {
            not: 'CANCELLED',
          },
        },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          status: true,
          instructor: {
            select: {
              name: true
            }
          }
        },
      });

      console.log('Todas las lecciones del instructor:', JSON.stringify(allLessons, null, 2));
    }

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

    // Log de solicitudes encontradas para depuración
    console.log('Solicitudes pendientes encontradas:', JSON.stringify(pendingRequests, null, 2));

    // Format the data to return unavailable time slots
    const unavailableSlots = [
      ...confirmedLessons.map(lesson => ({
        id: lesson.id,
        instructorName: lesson.instructor?.name || 'Unknown',
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        date: lesson.date.toISOString(),
        status: lesson.status,
        type: 'confirmed_lesson'
      })),
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
          endTime,
          date: request.lessonDate.toISOString(),
          status: request.lessonStatus,
          type: 'pending_request'
        };
      }),
    ];

    // Log final de slots no disponibles
    console.log('Slots no disponibles:', JSON.stringify(unavailableSlots, null, 2));

    return unavailableSlots;
  } catch (error) {
    console.error('Error getting unavailable time slots:', error);
    return [];
  }
}
