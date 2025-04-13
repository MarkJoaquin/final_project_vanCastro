import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const classes = await prisma.planClass.findMany({
      include: {
        plans: {
          include: {
            plan: true
          }
        }
      },
    });

    // Transform the data to match the expected format
    const transformedClasses = classes.map(planClass => ({
      id: planClass.id,
      name: planClass.name,
      title: planClass.title,
      description: planClass.description,
      plans: planClass.plans.map(relation => ({
        id: relation.plan.id,
        name: relation.plan.name,
        description: relation.plan.description,
        lessons: relation.plan.lessons,
        price: relation.plan.price,
        time: relation.plan.time
      }))
    }));

    return NextResponse.json(transformedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
