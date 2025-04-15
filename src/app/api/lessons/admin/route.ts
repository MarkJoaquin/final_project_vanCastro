import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, RequestStatus, LessonStatus, PaymentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate that all required fields are present
    const requiredFields = [
      'studentId', 'instructorId', 'lessonDate', 'lessonTime', 
      'lessonDuration', 'lessonLocation', 'lessonPlan', 
      'licenseClass', 'lessonPrice'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `The field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 400 }
      );
    }

    // Check if instructor exists
    const instructor = await prisma.instructor.findUnique({
      where: { id: data.instructorId }
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 400 }
      );
    }

    // Verify the plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: data.lessonPlan }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'The selected plan does not exist' },
        { status: 400 }
      );
    }

    // Generate a unique tracking number
    const trackingNumber = `DL-${Date.now().toString().slice(-6)}-${uuidv4().substring(0, 4)}`;

    // Create the lesson request
    const lessonRequest = await prisma.lessonsRequest.create({
      data: {
        studentId: data.studentId,
        instructorId: data.instructorId,
        lessonDate: new Date(data.lessonDate), // Convertir a formato DateTime
        startTime: data.lessonTime, // Corregido de 'lessonTime' a 'startTime'
        endTime: data.endTime || data.lessonTime,
        lessonDuration: data.lessonDuration,
        lessonLocation: data.lessonLocation,
        lessonPlan: plan.name,
        lessonPrice: data.lessonPrice,
        licenseClass: data.licenseClass,
        paymentMethod: data.paymentMethod || 'Cash',
        lessonStatus: 'CONFIRMED' as RequestStatus, // Usar el enum RequestStatus
        trackingNumber
      }
    });

    // También crear un registro en la tabla Lesson para que aparezca como lección confirmada
    const lesson = await prisma.lesson.create({
      data: {
        studentId: data.studentId,
        instructorId: data.instructorId,
        date: new Date(data.lessonDate),
        startTime: data.lessonTime,
        endTime: data.endTime || data.lessonTime,
        duration: data.lessonDuration,
        locationId: data.lessonLocation,
        plan: plan.name,
        price: data.lessonPrice,
        licenseClass: data.licenseClass,
        paymentMethod: data.paymentMethod || 'Cash',
        status: 'CONFIRMED' as LessonStatus,
        paymentStatus: 'PAID' as PaymentStatus, // Asumimos que las lecciones creadas por el instructor están pagadas
        trackingNumber
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lesson successfully created',
      trackingNumber,
      lessonRequest,
      lesson
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? error.message 
      : 'Error processing request';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
