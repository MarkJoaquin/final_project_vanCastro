import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    context: { params: { instructorId: string } }
) {
    try {
        const params = await context.params
        const instructorId = params.instructorId

        const availability = await prisma.availability.findMany({
            where: {
                instructorId: instructorId,
            },
            orderBy: {
                startTime: 'asc',
            },
            select: {
                startTime: true,
                endTime: true,
            }
        })

        return NextResponse.json(availability)
    } catch (error) {
        console.error('Error fetching availability:', error)
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
    }
}
