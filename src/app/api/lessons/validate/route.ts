import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateInstructorAvailability } from '@/lib/lessonValidations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instructorId, lessonDate, lessonTime, planId } = body;

    // Validate required fields
    if (!instructorId || !lessonDate || !lessonTime || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get plan details to determine lesson duration
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { time: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Convert lessonDate string to Date object
    const date = new Date(lessonDate);

    // Validate instructor availability
    const availabilityResult = await validateInstructorAvailability(
      instructorId,
      date,
      lessonTime,
      plan.time
    );

    if (!availabilityResult.isAvailable) {
      return NextResponse.json(
        { 
          isAvailable: false,
          message: availabilityResult.message || 'Time slot is not available'
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ isAvailable: true }, { status: 200 });
  } catch (error) {
    console.error('Error validating lesson availability:', error);
    return NextResponse.json(
      { error: 'Failed to validate lesson availability' },
      { status: 500 }
    );
  }
}
