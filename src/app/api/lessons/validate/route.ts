import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateInstructorAvailability } from '@/lib/lessonValidations';
import {validateTransitTime} from '@/lib/validateTransitTime';
import {validateFutureLessons} from '@/lib/validateFutureLessons'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instructorId, lessonDate, lessonTime, planId, locationId } = body;

    // Validate required fields
    if (!instructorId || !lessonDate || !lessonTime || !planId || !locationId) {
      return NextResponse.json(
        { 
          isAvailable: false,
          message: 'Missing required fields. Location is required for transit time validation.' 
        },
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

    // Validate transit time from previous lessons
    const transitResult = await validateTransitTime(
      instructorId,
      date,
      lessonTime,
      locationId
    );

    if (!transitResult.isValid) {
      return NextResponse.json(
        { 
          isAvailable: false,
          message: transitResult.message || 'The instructor cannot reach this location on time due to traffic restrictions'
        },
        { status: 200 }
      );
    }
    
    // Also validate transit time to future lessons
    const futureResult = await validateFutureLessons(
      instructorId,
      date,
      lessonTime,
      plan.time,
      locationId
    );
    
    if (!futureResult.isValid) {
      return NextResponse.json(
        {
          isAvailable: false,
          message: futureResult.message || 'The instructor will not have enough time to reach their next lesson after this booking'
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
