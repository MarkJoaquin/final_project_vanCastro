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
        { error: 'Only lesson requests with status REQUESTED can be declined' },
        { status: 400 }
      );
    }

    // Actualizar el estado de la solicitud a REJECTED
    const updatedRequest = await prisma.lessonsRequest.update({
      where: { id: requestId },
      data: {
        lessonStatus: 'REJECTED',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lesson request declined successfully',
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error declining lesson request:', error);
    return NextResponse.json(
      { error: 'Failed to decline lesson request' },
      { status: 500 }
    );
  }
}
