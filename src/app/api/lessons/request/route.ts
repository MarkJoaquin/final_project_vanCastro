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
      'instructor', 'dateTime', 'location', 'plan'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Verificar si el estudiante ya existe por email
    let student = await prisma.student.findUnique({
      where: { email: data.email }
    });

    // Preparar los datos para crear o actualizar el estudiante
    const studentData = {
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      language: null,
      // Nuevos campos añadidos al esquema
      birthDate: data.birthDate ? new Date(data.birthDate) : new Date(),
      country: data.country || '',
      hasLicense: data.hasDriverLicense === 'yes',
      hasRoadTest: data.hasBookedRoadTest === 'yes'
    };

    // Si no existe, crear un nuevo estudiante
    if (!student) {
        student = await prisma.student.create({
            data: studentData
        })
    } else {
      // Actualizar información del estudiante si ya existe
      student = await prisma.student.update({
        where: { id: student.id },
        data: {
          // Mantener el nombre y teléfono actualizados
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          // Actualizar los campos nuevos
          birthDate: studentData.birthDate,
          country: studentData.country,
          hasLicense: studentData.hasLicense,
          hasRoadTest: studentData.hasRoadTest
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

    // Extraer la fecha y hora del dateTime
    const dateTime = new Date(data.dateTime);

    // Crear una fecha con solo la parte de la fecha (hora 00:00:00)
    // Usamos UTC para evitar problemas con zonas horarias
    const lessonDate = new Date(Date.UTC(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      0, 0, 0, 0
    ));

    // Extraer la hora y minutos para startTime
    const startTime = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;

    // Calcular la hora de finalización sumando la duración del plan en minutos
    const endDateTime = new Date(dateTime.getTime() + plan.time * 60000);
    const endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;

    // Generar un número de seguimiento único
    const trackingNumber = uuidv4().substring(0, 8).toUpperCase();

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
        lessonPrice: plan.price.toString(),
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
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
