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
      // Campos birthDate y country eliminados
      hasLicense: data.hasDriverLicense ? data.hasDriverLicense === 'yes' : null, // Ahora es opcional
      hasRoadTest: data.hasLearnerPermit ? false : null, // Ya no usamos hasBookedRoadTest
      // Añadir URL del learner permit si existe
      learnerPermitUrl: data.learnerPermitUrl || null
    };
    
    console.log('Student data with learnerPermitUrl:', studentData);

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
          // Campos birthDate y country eliminados
          // Solo actualizar si hay un valor definido
          ...(studentData.hasLicense !== null && { hasLicense: studentData.hasLicense }),
          ...(studentData.hasRoadTest !== null && { hasRoadTest: studentData.hasRoadTest }),
          // Incluir URL del learner permit si existe
          ...(data.learnerPermitUrl && { learnerPermitUrl: data.learnerPermitUrl })
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
    
    // Obtener la fecha en formato ISO y extraer solo la parte de la fecha (YYYY-MM-DD)
    // Esto evita problemas con zonas horarias al crear la fecha
    const dateStr = dateTime.toISOString().split('T')[0];
    const lessonDate = new Date(dateStr + 'T00:00:00.000Z');
    
    // Para las horas, necesitamos considerar la zona horaria de Vancouver (PDT, UTC-7)
    // En producción, el servidor puede estar en UTC, así que necesitamos ajustar manualmente
    
    // Obtener la hora UTC
    const utcHours = dateTime.getUTCHours();
    const utcMinutes = dateTime.getUTCMinutes();
    
    // Ajustar a la zona horaria de Vancouver (PDT, UTC-7)
    // Restamos 7 horas a la hora UTC
    let vancouverHours = utcHours - 7;
    if (vancouverHours < 0) vancouverHours += 24; // Ajustar si la hora es negativa
    
    // Formatear la hora de inicio para Vancouver
    const startTime = `${vancouverHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
    
    // Calcular la hora de finalización sumando la duración del plan en minutos
    const endDateTime = new Date(dateTime.getTime() + plan.time * 60000);
    const endUtcHours = endDateTime.getUTCHours();
    let endVancouverHours = endUtcHours - 7;
    if (endVancouverHours < 0) endVancouverHours += 24;
    
    const endMinutes = endDateTime.getUTCMinutes();
    const endTime = `${endVancouverHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

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

    // Enviar correo de confirmación al estudiante
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-booking-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: lessonRequest.id }),
      });
      console.log('Booking confirmation email sent to student');
    } catch (emailError) {
      console.error('Error sending booking confirmation email:', emailError);
      // No interrumpimos el flujo si falla el envío del correo
    }

    // Enviar notificación al instructor
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-instructor-notification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: lessonRequest.id }),
      });
      console.log('Notification email sent to instructor');
    } catch (emailError) {
      console.error('Error sending instructor notification email:', emailError);
      // No interrumpimos el flujo si falla el envío del correo
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
          student: {
            include: {
              licenses: {
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            }
          },
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
        student: {
          include: {
            licenses: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        },
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
