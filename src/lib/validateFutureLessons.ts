import prisma from './prisma';

/**
 * Validates if an instructor has enough transit time before their next lesson
 * @param instructorId - The ID of the instructor
 * @param lessonDate - The date of the new lesson
 * @param lessonTime - The start time of the new lesson (format: "HH:MM")
 * @param lessonDuration - The duration of the lesson in minutes
 * @param locationId - The location ID of the new lesson
 * @returns An object with validation result and error message if applicable
 */
export async function validateFutureLessons(
  instructorId: string,
  lessonDate: Date,
  lessonTime: string,
  lessonDuration: number,
  locationId: string
): Promise<{ isValid: boolean; message?: string }> {
  try {
    console.log('Validando tiempo futuro para instructorId:', instructorId, 'fecha:', lessonDate.toISOString(), 'hora:', lessonTime);
    
    // Formatear la fecha para una mejor comparación
    const dateOnly = lessonDate.toISOString().split('T')[0];
    
    // Obtener los detalles de la ubicación de la lección solicitada
    const requestedLocation = await prisma.location.findUnique({
      where: { id: locationId },
      select: { city: true }
    });

    if (!requestedLocation) {
      return { isValid: false, message: 'Location not found' };
    }

    // Calcular hora de inicio y fin de la lección solicitada
    const [hours, minutes] = lessonTime.split(':').map(Number);
    const lessonStartTime = new Date(lessonDate);
    lessonStartTime.setHours(hours, minutes, 0, 0);
    
    const lessonEndTime = new Date(lessonStartTime);
    lessonEndTime.setMinutes(lessonEndTime.getMinutes() + lessonDuration);
    
    // Formatear el tiempo de fin como HH:MM
    const endTimeStr = `${lessonEndTime.getHours().toString().padStart(2, '0')}:${lessonEndTime.getMinutes().toString().padStart(2, '0')}`;
    
    console.log(`La lección solicitada terminaría a las: ${endTimeStr}`);
    
    // PASO 1: Buscar todas las lecciones para este instructor
    const allLessons = await prisma.lesson.findMany({
      where: {
        instructorId,
        status: {
          not: 'CANCELLED',
        }
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        duration: true,
        locationId: true,
        location: {
          select: {
            city: true
          }
        }
      }
    });
    
    // PASO 2: Filtrar manualmente lecciones del mismo día para verificar solapamientos
    const sameDayLessons = allLessons.filter(lesson => {
      const lessonDateStr = new Date(lesson.date).toISOString().split('T')[0];
      return lessonDateStr === dateOnly;
    });
    
    // PASO 3: Verificar solapamientos directos con lecciones existentes
    for (const lesson of sameDayLessons) {
      // Obtener tiempos de la lección existente
      const [existingStartHour, existingStartMin] = lesson.startTime.split(':').map(Number);
      const existingStartDateTime = new Date(lessonDate);
      existingStartDateTime.setHours(existingStartHour, existingStartMin, 0, 0);
      
      const [existingEndHour, existingEndMin] = lesson.endTime.split(':').map(Number);
      const existingEndDateTime = new Date(lessonDate);
      existingEndDateTime.setHours(existingEndHour, existingEndMin, 0, 0);
      
      // Verificar solapamiento (si la lección solicitada comienza antes de que termine la existente
      // Y termina después de que comience la existente)
      const hasOverlap = lessonStartTime < existingEndDateTime && lessonEndTime > existingStartDateTime;
      
      if (hasOverlap) {
        return {
          isValid: false,
          message: `No se puede agendar la lección porque se solapa con otra lección existente a las ${lesson.startTime}`
        };
      }
    }
    
    // PASO 4: También verificar solicitudes pendientes
    const allRequests = await prisma.lessonsRequest.findMany({
      where: {
        instructorId,
        lessonStatus: {
          notIn: ['REJECTED', 'LATE_RESPONSE'],
        }
      },
      select: {
        id: true,
        lessonDate: true,
        startTime: true,
        endTime: true,
        lessonDuration: true,
        lessonLocation: true
      }
    });
    
    // Filtrar solicitudes del mismo día
    const sameDayRequests = allRequests.filter(request => {
      const requestDateStr = new Date(request.lessonDate).toISOString().split('T')[0];
      return requestDateStr === dateOnly;
    });
    
    // Verificar solapamientos con solicitudes pendientes
    for (const request of sameDayRequests) {
      // Obtener tiempos de la solicitud existente
      const [reqStartHour, reqStartMin] = request.startTime.split(':').map(Number);
      const reqStartDateTime = new Date(lessonDate);
      reqStartDateTime.setHours(reqStartHour, reqStartMin, 0, 0);
      
      const [reqEndHour, reqEndMin] = request.endTime.split(':').map(Number);
      const reqEndDateTime = new Date(lessonDate);
      reqEndDateTime.setHours(reqEndHour, reqEndMin, 0, 0);
      
      // Verificar solapamiento
      const hasOverlap = lessonStartTime < reqEndDateTime && lessonEndTime > reqStartDateTime;
      
      if (hasOverlap) {
        return {
          isValid: false,
          message: `No se puede agendar la lección porque se solapa con una solicitud pendiente a las ${request.startTime}`
        };
      }
    }
    
    // PASO 5: Si no hay solapamientos, verificar el tiempo de tránsito para las lecciones futuras
    // Obtener lecciones que comienzan después de la nuestra (ordenadas por hora de inicio)
    const futureLessons = sameDayLessons
      .filter(lesson => {
        const [startHour, startMin] = lesson.startTime.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = hours * 60 + minutes + lessonDuration;
        return startTime > endTime;
      })
      .sort((a, b) => {
        const aTime = a.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
        const bTime = b.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
        return aTime - bTime;
      });
    
    // Si no hay lecciones futuras, no hay problema con el tiempo de tránsito
    if (futureLessons.length === 0) {
      return { isValid: true };
    }
    
    // Tomar la primera lección futura (la más cercana en tiempo)
    const nextLesson = futureLessons[0];
    const nextLocationId = nextLesson.locationId;
    
    // Obtener la ciudad de la próxima ubicación
    const nextLocation = await prisma.location.findUnique({
      where: { id: nextLocationId },
      select: { city: true }
    });
    
    if (!nextLocation) {
      return { isValid: false, message: 'Next lesson location not found' };
    }
    
    // Obtener el tiempo de tránsito entre las ubicaciones
    const transitTimeRecord = await prisma.transitTime.findUnique({
      where: {
        fromCity_toCity: {
          fromCity: requestedLocation.city,
          toCity: nextLocation.city
        }
      }
    });
    
    // Si no hay registro de tiempo de tránsito, intentar en la dirección opuesta
    let transitMinutes = 0;
    
    if (requestedLocation.city === nextLocation.city) {
      transitMinutes = 10; // Tiempo mínimo entre lecciones en la misma ubicación
    } else if (!transitTimeRecord) {
      const reverseTransitTimeRecord = await prisma.transitTime.findUnique({
        where: {
          fromCity_toCity: {
            fromCity: nextLocation.city,
            toCity: requestedLocation.city
          }
        }
      });
      
      if (reverseTransitTimeRecord) {
        transitMinutes = reverseTransitTimeRecord.time;
      } else {
        return { 
          isValid: false, 
          message: `Transit time between ${requestedLocation.city} and ${nextLocation.city} not found` 
        };
      }
    } else {
      transitMinutes = transitTimeRecord.time;
    }
    
    // Calcular si hay suficiente tiempo de tránsito
    const [nextStartHour, nextStartMin] = nextLesson.startTime.split(':').map(Number);
    const nextStartDateTime = new Date(lessonDate);
    nextStartDateTime.setHours(nextStartHour, nextStartMin, 0, 0);
    
    // ¿Es el tiempo de fin de la lección + tiempo de tránsito menor o igual que el tiempo de inicio de la siguiente lección?
    const transitEndTime = new Date(lessonEndTime);
    transitEndTime.setMinutes(transitEndTime.getMinutes() + transitMinutes);
    
    if (transitEndTime <= nextStartDateTime) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        message: `El instructor no tendrá tiempo suficiente para llegar a su siguiente lección. La lección siguiente empieza a las ${nextLesson.startTime}, y el tiempo de tránsito a ${nextLocation.city} es de ${transitMinutes} minutos.`
      };
    }
  } catch (error) {
    console.error('Error validating future lessons:', error);
    return { isValid: false, message: 'Error al validar tiempo de tránsito para lecciones futuras' };
  }
}