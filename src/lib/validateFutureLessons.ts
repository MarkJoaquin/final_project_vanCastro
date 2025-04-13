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
    
    // Formatear la fecha para una mejor comparación - usando la fecha local, no UTC
    const dateOnly = lessonDate.toISOString().split('T')[0];
    
    console.log(`Validando para la fecha: ${dateOnly}, zona horaria del servidor`);
    console.log(`Hora recibida del frontend: ${lessonTime}`);
    
    // Obtener los detalles de la ubicación de la lección solicitada
    const requestedLocation = await prisma.location.findUnique({
      where: { id: locationId },
      select: { city: true }
    });

    if (!requestedLocation) {
      return { isValid: false, message: 'Location not found' };
    }

    // Calcular hora de inicio y fin de la lección solicitada
    // IMPORTANTE: Creamos la fecha desde cero para evitar problemas de timezone
    const [hours, minutes] = lessonTime.split(':').map(Number);
    
    // Usar una fecha limpia con los componentes de fecha y hora extraídos manualmente
    const year = lessonDate.getFullYear();
    const month = lessonDate.getMonth();
    const day = lessonDate.getDate();
    
    // Crear fechas de inicio y fin exactas sin manipulación de zona horaria
    const lessonStartTime = new Date(year, month, day, hours, minutes, 0, 0);
    
    const lessonEndTime = new Date(year, month, day, hours, minutes, 0, 0);
    lessonEndTime.setMinutes(lessonEndTime.getMinutes() + lessonDuration);
    
    console.log(`Hora inicio de lección (local): ${hours}:${minutes.toString().padStart(2, '0')}`);
    console.log(`Hora inicio ISO: ${lessonStartTime.toISOString()}`);
    console.log(`Hora local: ${lessonStartTime.toString()}`);
    
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
      const existingStartDateTime = new Date(year, month, day, existingStartHour, existingStartMin, 0, 0);
      
      const [existingEndHour, existingEndMin] = lesson.endTime.split(':').map(Number);
      const existingEndDateTime = new Date(year, month, day, existingEndHour, existingEndMin, 0, 0);
      
      // Verificar solapamiento (si la lección solicitada comienza antes de que termine la existente
      // Y termina después de que comience la existente)
      const hasOverlap = lessonStartTime < existingEndDateTime && lessonEndTime > existingStartDateTime;
      
      if (hasOverlap) {
        return {
          isValid: false,
          message: `Cannot schedule the lesson because it overlaps with an existing lesson at ${lesson.startTime}`
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
        lessonLocation: true,
        lessonStatus: true
      }
    });
    
    // Filtrar las solicitudes para el mismo día
    const sameDayRequests = allRequests.filter(request => {
      const requestDate = new Date(request.lessonDate).toISOString().split('T')[0];
      return requestDate === dateOnly;
    });
    
    // Verificar solapamientos con solicitudes pendientes
    for (const request of sameDayRequests) {
      // Obtener tiempos de la solicitud existente, usando el mismo método para todas las fechas
      const [reqStartHour, reqStartMin] = request.startTime.split(':').map(Number);
      const reqStartDateTime = new Date(year, month, day, reqStartHour, reqStartMin, 0, 0);
      
      // Obtener tiempos de fin de la solicitud directamente
      const [reqEndHour, reqEndMin] = request.endTime.split(':').map(Number);
      const reqEndDateTime = new Date(year, month, day, reqEndHour, reqEndMin, 0, 0);
      
      // Verificar solapamiento
      const hasOverlap = lessonStartTime < reqEndDateTime && lessonEndTime > reqStartDateTime;
      
      console.log(`Verificando solapamiento con solicitud pendiente ${request.id}:`);
      console.log(`- Lección nueva: ${lessonStartTime.getHours()}:${lessonStartTime.getMinutes().toString().padStart(2, '0')} a ${lessonEndTime.getHours()}:${lessonEndTime.getMinutes().toString().padStart(2, '0')}`);
      console.log(`- Solicitud existente: ${reqStartDateTime.getHours()}:${reqStartDateTime.getMinutes().toString().padStart(2, '0')} a ${reqEndDateTime.getHours()}:${reqEndDateTime.getMinutes().toString().padStart(2, '0')}`);
      console.log(`- ¿Hay solapamiento? ${hasOverlap ? 'SÍ' : 'NO'}`);
      
      if (hasOverlap) {
        return {
          isValid: false,
          message: `Cannot schedule the lesson because it overlaps with a pending request at ${request.startTime}`
        };
      }
    }
    
    // PASO 5: Procesar también las solicitudes pendientes para verificar si hay alguna inmediatamente después
    // Aquí creamos un array de objetos de tipo "lección" a partir de las solicitudes pendientes
    // para poder tratarlas de manera similar a las lecciones confirmadas
    const pendingRequestsAsLessons = [];
    
    for (const request of sameDayRequests) {
      // Verificar si la solicitud comienza justo cuando termina nuestra lección o después
      const [reqStartHour, reqStartMin] = request.startTime.split(':').map(Number);
      const requestStartTime = reqStartHour * 60 + reqStartMin;
      const ourEndTime = hours * 60 + minutes + lessonDuration;
      
      if (requestStartTime >= ourEndTime) {
        console.log(`Solicitud pendiente ${request.id} detectada como 'futura':`);
        console.log(`- Comienza a las: ${request.startTime} en ubicación: ${request.lessonLocation}`);
        console.log(`- Nuestra lección termina a las: ${endTimeStr}`);
        
        // Crear un pseudo-objeto lección a partir de la solicitud
        pendingRequestsAsLessons.push({
          id: request.id,
          startTime: request.startTime,
          endTime: request.endTime,
          locationId: request.lessonLocation,
          isPendingRequest: true, // Marcador para identificar que es una solicitud pendiente
          // Añadir propiedades adicionales para hacerlo compatible con el tipo de lecciones
          date: new Date(), // No es relevante para la validación de tiempo
          duration: request.lessonDuration || '0', // Usar cero por defecto
          location: { city: '' } // Ciudad vacía que se rellenará más adelante
        });
      }
    }
    
    console.log(`Se encontraron ${pendingRequestsAsLessons.length} solicitudes pendientes que ocurren después de esta lección`);

    // PASO 6: Si no hay solapamientos, verificar el tiempo de tránsito para las lecciones futuras
    // Obtener lecciones que comienzan después O AL MISMO TIEMPO QUE TERMINA la nuestra
    // IMPORTANTE: Incluimos TODAS las lecciones que comienzan después o al mismo tiempo que termina esta lección
    // para verificar el tiempo de tránsito, independientemente de si hay solapamiento directo
    const futureLessons = sameDayLessons
      .filter(lesson => {
        const [startHour, startMin] = lesson.startTime.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = hours * 60 + minutes + lessonDuration;
        
        // CAMBIO CRUCIAL: Ahora consideramos como "futura" incluso si comienza exactamente cuando termina la nuestra
        // Esto es importante porque si las ubicaciones son diferentes, necesitaremos tiempo de tránsito
        const result = startTime >= endTime; // Cambiado '>' a '>=' para incluir lecciones que comienzan cuando termina esta
        
        console.log(`Evaluando lección futura ${lesson.id}:`);
        console.log(`- Hora inicio lección futura: ${lesson.startTime} (${startTime} minutos)`);
        console.log(`- Hora fin lección actual: ${endTimeStr} (${endTime} minutos)`);
        console.log(`- Ubicación lección futura: ${lesson.locationId}`);
        console.log(`- Ubicación lección solicitada: ${locationId}`);
        console.log(`- ¿Es futura o simultánea? ${result ? 'SÍ' : 'NO'}`);
        console.log(`- ¿Ubicaciones diferentes? ${lesson.locationId !== locationId ? 'SÍ' : 'NO'}`);
        
        return result;
      })
      .sort((a, b) => {
        const aTime = a.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
        const bTime = b.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
        return aTime - bTime;
      });
    
    // PASO 7: CRUCIAL - Combinar las lecciones confirmadas y las solicitudes pendientes en un solo array
    // y ordenarlas por hora de inicio para validación de tiempo de tránsito
    const allFutureLessonsAndRequests = [...futureLessons, ...pendingRequestsAsLessons].sort((a, b) => {
      const aTime = a.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
      const bTime = b.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
      return aTime - bTime;
    });
    
    console.log(`Total de lecciones y solicitudes futuras combinadas: ${allFutureLessonsAndRequests.length}`);
    allFutureLessonsAndRequests.forEach(item => {
      // Verificar si es una solicitud pendiente usando comprobación de propiedad segura
      const isPending = 'isPendingRequest' in item && item.isPendingRequest;
      console.log(`- ${isPending ? 'SOLICITUD PENDIENTE' : 'LECCIÓN'} a las ${item.startTime} en ubicación ${item.locationId}`);
    });
    console.log(`IMPORTANTE: Cualquier lección futura en ubicación diferente requerirá tiempo de tránsito`);
    console.log('NOTA: Estamos incluyendo lecciones que comienzan al mismo tiempo que termina esta lección si están en ubicaciones diferentes');
    
    // Si no hay lecciones futuras ni solicitudes pendientes en el mismo día, debemos verificar si hay lecciones
    // programadas para el día siguiente (especialmente si es una lección al final del día)
    // ESTO ES IMPORTANTE: También verificamos si hay lecciones al día siguiente que requieran cambio de ubicación
    if (allFutureLessonsAndRequests.length === 0) {
      // Si la lección termina después de las 8 PM (20:00), verificamos el día siguiente
      const lessonEndHour = lessonEndTime.getHours();
      
      if (lessonEndHour >= 20) {
        // Buscar lecciones del día siguiente (primeras horas)
        const nextDay = new Date(lessonDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0];
        
        const nextDayLessons = allLessons.filter(lesson => {
          const lessonDateStr = new Date(lesson.date).toISOString().split('T')[0];
          return lessonDateStr === nextDayStr;
        });
        
        // Encontrar la primera lección del día siguiente (si existe)
        const earlyMorningLessons = nextDayLessons
          .filter(lesson => {
            const [startHour, startMin] = lesson.startTime.split(':').map(Number);
            return startHour < 10; // Lecciones antes de las 10 AM
          })
          .sort((a, b) => {
            const aTime = a.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
            const bTime = b.startTime.split(':').map(Number).reduce((h, m) => h * 60 + m, 0);
            return aTime - bTime;
          });
        
        // Si hay lecciones temprano al día siguiente, verificamos que haya tiempo suficiente para descanso
        if (earlyMorningLessons.length > 0) {
          const nextLesson = earlyMorningLessons[0];
          
          // Obtener la ciudad de la próxima ubicación
          const nextLocation = await prisma.location.findUnique({
            where: { id: nextLesson.locationId },
            select: { city: true }
          });
          
          if (nextLocation && nextLocation.city !== requestedLocation.city) {
            return {
              isValid: false,
              message: `This booking is too late in the day. The instructor has an early lesson at ${nextLesson.startTime} tomorrow in ${nextLocation.city}.`
            };
          }
        }
      }
      
      return { isValid: true };
    }
    
    // PASO 8: Verificar tiempo de tránsito para lecciones futuras o solicitudes pendientes el mismo día
    // Tomar la primera lección/solicitud futura (la más cercana en tiempo)
    const nextLesson = allFutureLessonsAndRequests[0];
    const nextLocationId = nextLesson.locationId;
    
    // Verificar si es una solicitud pendiente usando comprobación de propiedad segura
    const isPendingRequest = 'isPendingRequest' in nextLesson && nextLesson.isPendingRequest;
    console.log(`Analizando próxima lección/solicitud: ${isPendingRequest ? 'SOLICITUD PENDIENTE' : 'LECCIÓN CONFIRMADA'}`);
    console.log(`- Hora de inicio: ${nextLesson.startTime}`);
    console.log(`- ID ubicación: ${nextLocationId}`);
    
    console.log(`Verificando tiempo de tránsito para la próxima lección: ${nextLesson.id}`);
    console.log(`- Ubicación de la próxima lección: ${nextLocationId}`);
    
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
    const nextStartDateTime = new Date(year, month, day, nextStartHour, nextStartMin, 0, 0);
    
    // ¿Es el tiempo de fin de la lección + tiempo de tránsito menor o igual que el tiempo de inicio de la siguiente lección?
    const transitEndTime = new Date(lessonEndTime);
    transitEndTime.setMinutes(transitEndTime.getMinutes() + transitMinutes);
    
    console.log(`Calculando tiempo de tránsito:`);
    console.log(`- La lección solicitada termina a las: ${lessonEndTime.getHours()}:${lessonEndTime.getMinutes().toString().padStart(2, '0')}`);
    console.log(`- Ubicación solicitada: ${requestedLocation.city}`);
    console.log(`- Próxima ubicación: ${nextLocation.city}`);
    console.log(`- Tiempo de tránsito entre ubicaciones: ${transitMinutes} minutos`);
    console.log(`- Hora de llegada estimada: ${transitEndTime.getHours()}:${transitEndTime.getMinutes().toString().padStart(2, '0')}`);
    console.log(`- La próxima lección comienza a las: ${nextStartDateTime.getHours()}:${nextStartDateTime.getMinutes().toString().padStart(2, '0')}`);
    console.log(`- ¿Hay suficiente tiempo para el tránsito? ${transitEndTime <= nextStartDateTime ? 'SÍ' : 'NO'}`);
    
    // La parte más importante: asegurarnos de que verificamos siempre el tiempo de tránsito si las ubicaciones son diferentes
    if (requestedLocation.city !== nextLocation.city) {
      console.log('ATENCIÓN: Las ubicaciones son diferentes, validando tiempo de tránsito obligatoriamente');
      
      // CASO ESPECIAL: Si las ubicaciones son diferentes y la siguiente lección comienza exactamente cuando termina esta
      // entonces ya sabemos que no hay tiempo de tránsito suficiente (necesitamos al menos algo de tiempo)
      const [lessonEndHour, lessonEndMin] = endTimeStr.split(':').map(Number);
      const lessonEndMinutes = lessonEndHour * 60 + lessonEndMin;
      const nextLessonMinutes = nextStartHour * 60 + nextStartMin;
      
      if (lessonEndMinutes === nextLessonMinutes && transitMinutes > 0) {
        console.log('CASO ESPECIAL: La siguiente lección comienza exactamente cuando termina esta, pero están en diferentes ubicaciones.');
        return {
          isValid: false,
          message: `The instructor cannot make it to the next lesson on time. Your lesson would finish at ${endTimeStr} in ${requestedLocation.city}, and the next lesson starts at ${nextLesson.startTime} in ${nextLocation.city}. The transit time required is ${transitMinutes} minutes.`
        };
      }
    }
    
    if (transitEndTime <= nextStartDateTime) {
      return { isValid: true };
    } else {
      // Calcular cuánto tiempo falta para que sea viable
      const minutesShort = Math.ceil((transitEndTime.getTime() - nextStartDateTime.getTime()) / 60000);
      
      console.log(`Se necesitarían ${minutesShort} minutos menos para que sea viable`);
      
      return {
        isValid: false,
        message: `The instructor will not have enough time to reach their next lesson. The next lesson starts at ${nextLesson.startTime} in ${nextLocation.city}, and the transit time from ${requestedLocation.city} is ${transitMinutes} minutes. You would need to book ${minutesShort} minutes earlier.`
      };
    }
  } catch (error) {
    console.error('Error validating future lessons:', error);
    return { isValid: false, message: 'Error validating transit time for future lessons' };
  }
}