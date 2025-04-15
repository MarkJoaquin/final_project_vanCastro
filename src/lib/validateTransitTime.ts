import prisma from './prisma';

/**
 * Validates if an instructor has enough transit time between lessons
 * @param instructorId - The ID of the instructor
 * @param lessonDate - The date of the new lesson
 * @param lessonTime - The start time of the new lesson (format: "HH:MM")
 * @param locationId - The location ID of the new lesson
 * @returns An object with validation result and error message if applicable
 */
export async function validateTransitTime(
  instructorId: string,
  lessonDate: Date,
  lessonTime: string,
  locationId: string
): Promise<{ isValid: boolean; message?: string }> {
  try {
    // Normalizar la fecha para evitar problemas de zona horaria
    // Usamos solo la parte de fecha (YYYY-MM-DD) y trabajamos con eso
    const normalizedDate = new Date(lessonDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    console.log('Validando tiempo de tránsito para instructorId:', instructorId, 'fecha:', lessonDate.toISOString(), 'hora:', lessonTime);
    
    // Extraemos solo la fecha sin la hora para evitar problemas de timezone
    const dateStr = lessonDate.toISOString().split('T')[0]; // formato YYYY-MM-DD
    console.log('Fecha a consultar (formato string):', dateStr);

    // Obtener los detalles de la ubicación para la nueva lección
    const newLocation = await prisma.location.findUnique({
      where: { id: locationId },
      select: { city: true }
    });

    console.log('Nueva ubicación:', newLocation);

    if (!newLocation) {
      return { isValid: false, message: 'Location not found' };
    }

    // Calculate time before the requested lesson
    const [hours, minutes] = lessonTime.split(':').map(Number);
    const requestedLessonDateTime = new Date(normalizedDate);
    requestedLessonDateTime.setHours(hours, minutes, 0, 0);
    
    console.log('Tiempo de inicio de lección:', requestedLessonDateTime.toISOString());
    
    // Buscar TODAS las lecciones de este instructor (sin filtrar por fecha/hora primero)
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
        locationId: true,
        location: {
          select: {
            city: true
          }
        }
      },
    });
    
    console.log('TODAS las lecciones de este instructor:', JSON.stringify(allLessons, null, 2));
    
    // Filtrar manualmente las lecciones del mismo día y que terminan antes de la lección solicitada
    const sameDayLessons = allLessons.filter(lesson => {
      // Create start and end of day for range query using normalized date
      const dateOnly = normalizedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const startOfDay = new Date(`${dateOnly}T00:00:00.000Z`);
      const endOfDay = new Date(`${dateOnly}T23:59:59.999Z`);
      
      const lessonDateNormalized = new Date(lesson.date.toISOString().split('T')[0] + 'T00:00:00.000Z');
      return lessonDateNormalized >= startOfDay && lessonDateNormalized <= endOfDay;
    });
    
    console.log('Fecha solicitada (UTC):', new Date(lessonDate).getUTCFullYear(), new Date(lessonDate).getUTCMonth(), new Date(lessonDate).getUTCDate());
    
    console.log('Lecciones del mismo día:', JSON.stringify(sameDayLessons, null, 2));
    
    // Buscar lecciones previas (que terminan antes de la lección solicitada)
    const previousLessons = sameDayLessons.filter(lesson => {
      const lessonDateNormalized = new Date(lesson.date.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const [lessonHours, lessonMinutes] = lesson.endTime.split(':').map(Number);
      const lessonEndDateTime = new Date(lessonDateNormalized);
      lessonEndDateTime.setHours(lessonHours, lessonMinutes, 0, 0);
      
      return lessonEndDateTime < requestedLessonDateTime;
    }).sort((a, b) => {
      // Parse the lesson end time - normalizar fecha primero
      const aLessonDateNormalized = new Date(a.date.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const [aLessonHours, aLessonMinutes] = a.endTime.split(':').map(Number);
      const aLessonEndDateTime = new Date(aLessonDateNormalized);
      aLessonEndDateTime.setHours(aLessonHours, aLessonMinutes, 0, 0);

      const bLessonDateNormalized = new Date(b.date.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const [bLessonHours, bLessonMinutes] = b.endTime.split(':').map(Number);
      const bLessonEndDateTime = new Date(bLessonDateNormalized);
      bLessonEndDateTime.setHours(bLessonHours, bLessonMinutes, 0, 0);

      // Ordenar por hora de finalización (descendente)
      // Convertir las fechas a timestamps numéricos antes de restarlos
      return bLessonEndDateTime.getTime() - aLessonEndDateTime.getTime(); // Ordenar descendente
    });
    
    console.log('Lecciones previas (ordenadas por tiempo de fin):', JSON.stringify(previousLessons, null, 2));
    
    // También buscar solicitudes pendientes
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
        lessonLocation: true
      },
    });
    
    const sameDayRequests = allRequests.filter(req => {
      // Normalizamos ambas fechas para compararlas de manera consistente
      const reqDateString = new Date(req.lessonDate).toISOString().split('T')[0];
      const lessonDateString = normalizedDate.toISOString().split('T')[0];
      
      // Ahora comparamos simplemente las cadenas de fecha YYYY-MM-DD
      return reqDateString === lessonDateString;
    });
    
    const previousRequests = sameDayRequests.filter(req => {
      const [endHour, endMin] = req.endTime.split(':').map(Number);
      const endInMinutes = endHour * 60 + endMin;
      
      const requestInMinutes = hours * 60 + minutes;
      
      return endInMinutes < requestInMinutes;
    }).sort((a, b) => {
      // Ordenar por hora de finalización (descendente)
      const [aEndHour, aEndMin] = a.endTime.split(':').map(Number);
      const aEndInMinutes = aEndHour * 60 + aEndMin;
      
      const [bEndHour, bEndMin] = b.endTime.split(':').map(Number);
      const bEndInMinutes = bEndHour * 60 + bEndMin;
      
      return bEndInMinutes - aEndInMinutes; // Ordenar descendente
    });
    
    console.log('Solicitudes previas (ordenadas por tiempo de fin):', JSON.stringify(previousRequests, null, 2));
    
    // Determinar cuál es la lección o solicitud más reciente
    let previousLesson = null;
    let previousRequest = null;
    
    if (previousLessons.length > 0) {
      previousLesson = previousLessons[0]; // La más reciente
    }
    
    if (previousRequests.length > 0) {
      previousRequest = previousRequests[0]; // La más reciente
    }
    
    console.log('Lección previa encontrada:', previousLesson);
    console.log('Solicitud previa encontrada:', previousRequest);

    // If there's no previous lesson or request, transit time is not an issue
    if (!previousLesson && !previousRequest) {
      return { isValid: true };
    }

    // Determine which previous booking to use (lesson or request), based on which ends later
    let prevEndTime = '';
    let prevLocationId = '';
    let prevLocationType = '';

    if (previousLesson && previousRequest) {
      // Compare end times to use the latest one
      const lessonDateNormalized = new Date(previousLesson.date.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const [lessonHours, lessonMinutes] = previousLesson.endTime.split(':').map(Number);
      const lessonEndDateTime = new Date(lessonDateNormalized);
      lessonEndDateTime.setHours(lessonHours, lessonMinutes, 0, 0);

      const requestDateNormalized = new Date(previousRequest.lessonDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const [requestHours, requestMinutes] = previousRequest.endTime.split(':').map(Number);
      const requestEndDateTime = new Date(requestDateNormalized);
      requestEndDateTime.setHours(requestHours, requestMinutes, 0, 0);

      if (lessonEndDateTime >= requestEndDateTime) {
        prevEndTime = previousLesson.endTime;
        prevLocationId = previousLesson.locationId;
        prevLocationType = 'lesson';
      } else {
        prevEndTime = previousRequest.endTime;
        prevLocationId = previousRequest.lessonLocation;
        prevLocationType = 'request';
      }
    } else if (previousLesson) {
      prevEndTime = previousLesson.endTime;
      prevLocationId = previousLesson.locationId;
      prevLocationType = 'lesson';
    } else if (previousRequest) {
      prevEndTime = previousRequest.endTime;
      prevLocationId = previousRequest.lessonLocation;
      prevLocationType = 'request';
    } else {
      // Este caso no debería ocurrir debido a la validación anterior (!previousLesson && !previousRequest)
      // Pero lo incluimos para manejar todos los casos posibles
      return { isValid: true };
    }

    // Get location details based on the type
    let previousLocationCity = '';
    if (prevLocationType === 'lesson') {
      try {
        const locationDetails = await prisma.location.findUnique({
          where: { id: prevLocationId },
          select: { city: true }
        });
        if (!locationDetails) {
          console.warn('Previous lesson location not found with ID:', prevLocationId);
          return { isValid: false, message: 'Previous lesson location not found' };
        }
        previousLocationCity = locationDetails.city;
      } catch (error) {
        console.error('Error getting lesson location:', error);
        return { isValid: false, message: 'Error retrieving previous location details' };
      }
    } else {
      // Para solicitudes, comprobamos primero si es un ID válido
      // Si no podemos encontrarlo como ID, asumimos que es directamente el nombre de la ciudad
      try {
        // Verificamos si parece un ID válido (formato ObjectId de MongoDB o UUID)
        const isValidId = /^[0-9a-fA-F]{24}$/.test(prevLocationId) || 
                         /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(prevLocationId);
        
        if (isValidId) {
          // Intentar buscar por ID
          const locationDetails = await prisma.location.findUnique({
            where: { id: prevLocationId },
            select: { city: true }
          });
          
          if (locationDetails) {
            previousLocationCity = locationDetails.city;
          } else {
            // Si no encontramos ubicación con ese ID, asumimos que es el nombre de la ciudad
            previousLocationCity = prevLocationId;
          }
        } else {
          // Si no parece un ID válido, asumimos que es directamente el nombre de la ciudad
          previousLocationCity = prevLocationId;
        }
      } catch (error) {
        console.error('Error processing location:', error);
        // Si hay error, usamos el valor directamente y esperamos que sea el nombre de la ciudad
        previousLocationCity = prevLocationId;
      }
    }
    
    console.log('Ciudad de la ubicación previa:', previousLocationCity);

    if (!previousLocationCity) {
      return { isValid: false, message: 'Could not determine previous location' };
    }

    // Get the transit time between the two locations
    const transitTimeRecord = await prisma.transitTime.findUnique({
      where: {
        fromCity_toCity: {
          fromCity: previousLocationCity,
          toCity: newLocation.city
        }
      }
    });

    // If there's no transit time record, we need to check the reverse direction
    let transitMinutes = 0;
    
    // Si la ubicación anterior es la misma que la nueva, usar un tiempo fijo de 10 minutos
    if (previousLocationCity === newLocation.city) {
      console.log('Misma ubicación detectada. Usando tiempo de transición mínimo de 10 minutos');
      transitMinutes = 10; // Tiempo mínimo entre lecciones en el mismo lugar
    } else if (!transitTimeRecord) {
      // Si son ubicaciones diferentes y no hay registro directo, buscar en la dirección inversa
      const reverseTransitTimeRecord = await prisma.transitTime.findUnique({
        where: {
          fromCity_toCity: {
            fromCity: newLocation.city,
            toCity: previousLocationCity
          }
        }
      });

      if (reverseTransitTimeRecord) {
        transitMinutes = reverseTransitTimeRecord.time;
      } else {
        // Si aún no tenemos un tiempo de tránsito, usar un valor predeterminado o devolver un error
        return { isValid: false, message: `Transit time between ${previousLocationCity} and ${newLocation.city} not found` };
      }
    } else {
      transitMinutes = transitTimeRecord.time;
    }
    
    console.log(`Tiempo de tránsito calculado: ${transitMinutes} minutos desde ${previousLocationCity} hasta ${newLocation.city}`);

    // Calculate the earliest possible start time after the previous booking
    const [prevHours, prevMinutes] = prevEndTime.split(':').map(Number);
    const prevEndDateTime = new Date(normalizedDate);
    prevEndDateTime.setHours(prevHours, prevMinutes, 0, 0);

    const earliestPossibleStart = new Date(prevEndDateTime);
    earliestPossibleStart.setMinutes(earliestPossibleStart.getMinutes() + transitMinutes);

    // Check if the requested lesson start time is after the earliest possible start
    if (requestedLessonDateTime >= earliestPossibleStart) {
      return { isValid: true };
    } else {
      const earliestTimeStr = `${earliestPossibleStart.getHours().toString().padStart(2, '0')}:${earliestPossibleStart.getMinutes().toString().padStart(2, '0')}`;
      return {
        isValid: false,
        message: `The instructor cannot reach on time. The previous lesson ends at ${prevEndTime}, and the transit time to ${newLocation.city} is ${transitMinutes} minutes. The earliest possible time is ${earliestTimeStr}.`
      };
    }
  } catch (error) {
    console.error('Error validating transit time:', error);
    return { isValid: false, message: 'Error validating transit time' };
  }
}