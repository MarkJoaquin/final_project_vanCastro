import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar que todos los campos requeridos estén presentes
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'instructor', 'dateTime', 'location', 'plan', 'licenseClass'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Validar que el email tenga un formato válido
    if (!data.email || !data.email.includes('@')) {
      return NextResponse.json(
        { error: 'El email proporcionado no es válido' },
        { status: 400 }
      );
    }
    
    // Normalizar el email (convertir a minúsculas)
    const normalizedEmail = data.email.toLowerCase().trim();
    
    // Verificar si el estudiante ya existe por email
    let student = await prisma.student.findUnique({
      where: { email: normalizedEmail }
    });

    // Preparar los datos para crear o actualizar el estudiante
    const studentData = {
      email: normalizedEmail, // Usar el email normalizado
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      language: null,
      // Nuevos campos añadidos al esquema
      birthDate: data.birthDate && data.birthDate !== '' ? new Date(data.birthDate) : null, // Ahora es opcional
      country: data.country || null, // Ahora es opcional
      hasLicense: data.hasDriverLicense ? data.hasDriverLicense === 'yes' : null, // Ahora es opcional
      hasRoadTest: data.hasBookedRoadTest ? data.hasBookedRoadTest === 'yes' : null // Ahora es opcional
    };

    // Asegurarnos de que los campos booleanos tengan valores predeterminados para la creación
    const createData = {
      ...studentData,
      // Para la creación, los campos booleanos no pueden ser null
      hasLicense: studentData.hasLicense ?? false,
      hasRoadTest: studentData.hasRoadTest ?? false
    };

    // Si no existe, crear un nuevo estudiante
    if (!student) {
        student = await prisma.student.create({
            data: createData
        })
    } else {
      // Para la actualización, podemos usar valores opcionales
      student = await prisma.student.update({
        where: { id: student.id },
        data: {
          // Mantener el nombre y teléfono actualizados
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          // Actualizar los campos nuevos
          birthDate: studentData.birthDate,
          country: studentData.country,
          // Solo actualizar si hay un valor definido
          ...(studentData.hasLicense !== null && { hasLicense: studentData.hasLicense }),
          ...(studentData.hasRoadTest !== null && { hasRoadTest: studentData.hasRoadTest })
        }
      });
    }

    // Obtener información del plan seleccionado
    const plan = await prisma.plan.findUnique({
      where: { id: data.plan }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'El plan seleccionado no existe' },
        { status: 400 }
      );
    }
    
    // Obtener información de la clase seleccionada
    const licenseClass = await prisma.planClass.findUnique({
      where: { id: data.licenseClass }
    });

    if (!licenseClass) {
      return NextResponse.json(
        { error: 'La clase de licencia seleccionada no existe' },
        { status: 400 }
      );
    }

    // Extraer la fecha y hora del dateTime
    const dateTime = new Date(data.dateTime);
    
    // Crear una fecha con solo la parte de la fecha (hora 00:00:00)
    // Usamos la fecha local para evitar problemas con zonas horarias
    const lessonDate = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate()
    );
    
    // Ajustar para la zona horaria de Vancouver (PDT, UTC-7)
    // Extraer la hora y minutos para startTime usando getHours() que ya está en hora local
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Calcular la hora de finalización sumando la duración del plan en minutos
    const endDateTime = new Date(dateTime.getTime() + plan.time * 60000);
    const endHours = endDateTime.getHours();
    const endMinutes = endDateTime.getMinutes();
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    // Generar un número de seguimiento único
    const trackingNumber = uuidv4().substring(0, 8).toUpperCase();

    // Calcular el precio con GST (5%)
    const subtotal = plan.price;
    const gst = subtotal * 0.05;
    const totalPrice = subtotal + gst;
    
    // Crear la solicitud de lección
    const lessonRequest = await prisma.lessonsRequest.create({
      data: {
        studentId: student.id,
        instructorId: data.instructor,
        lessonDate: lessonDate, // Usar la fecha con hora 00:00:00
        startTime,
        endTime,
        lessonDuration: plan.time.toString(),
        lessonLocation: data.location, // Ahora es una referencia a la tabla Location como ObjectId
        lessonPlan: plan.name,
        lessonPrice: totalPrice.toFixed(2).toString(), // Precio con GST incluido
        licenseClass: licenseClass.name, // Guardamos el nombre de la clase en lugar del ID
        paymentMethod: data.paymentMethod || 'Not specified', // Guardamos el método de pago
        lessonStatus: 'REQUESTED',
        trackingNumber
      }
    });

    // Si el estudiante tiene licencia, guardarla
    if (data.hasDriverLicense === 'yes' && data.licenseNumber && data.licenseType && data.licenseExpiryDate) {
      // Verificar si ya existe una licencia para este estudiante
      const existingLicense = await prisma.license.findUnique({
        where: { studentId: student.id }
      });

      if (!existingLicense) {
        await prisma.license.create({
          data: {
            studentId: student.id,
            licenseType: data.licenseType,
            licenseNumber: data.licenseNumber,
            expirationDate: new Date(data.licenseExpiryDate)
          }
        });
      }
    }

    // Si el estudiante ha reservado un road test, guardarlo
    if (data.hasBookedRoadTest === 'yes' && data.roadTestLocation) {
      // Extraer ciudad y dirección del roadTestLocation
      const [city, address] = data.roadTestLocation.split(' - ');

      await prisma.roadTest.create({
        data: {
          studentId: student.id,
          city: city || 'Vancouver',
          address: address || data.roadTestLocation,
          zip: '' // Campo requerido pero no tenemos esta información
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud de lección creada exitosamente',
      trackingNumber,
      lessonRequest
    });

  } catch (error) {
    console.error('Error al crear la solicitud de lección:', error);
    
    // Manejar errores específicos de Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      // Es un error de Prisma
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('email')) {
        return NextResponse.json(
          { error: 'Ya existe un estudiante con este email' },
          { status: 400 }
        );
      }
    }
    
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? error.message 
      : 'Error al procesar la solicitud';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Filtrar por trackingNumber si se proporciona
    const trackingNumber = searchParams.get('trackingNumber');
    if (trackingNumber) {
      const lessonRequest = await prisma.lessonsRequest.findFirst({
        where: { trackingNumber },
        include: {
          student: true, // Incluye información del estudiante
          instructor: true // Incluye información del instructor
        }
      });

      if (!lessonRequest) {
        return NextResponse.json(
          { error: 'No se encontró una solicitud con este número de seguimiento' },
          { status: 404 }
        );
      }

      return NextResponse.json(lessonRequest);
    }

    // Si no se proporciona trackingNumber, devolver todas las solicitudes
    const lessonRequests = await prisma.lessonsRequest.findMany({
      include: {
        student: true, // Incluye información del estudiante
        instructor: true // Incluye información del instructor
      }
    });

    return NextResponse.json(lessonRequests);
  } catch (error) {
    console.error('Error al obtener las solicitudes de lección:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
