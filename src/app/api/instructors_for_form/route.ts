import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const instructors = await prisma.instructor.findMany({
            select: {
                id: true,
                name: true,
                languages: true,
                experienceYears: true,
            }
        })
        return NextResponse.json(instructors)
    } catch (error) {
        console.error('Error fetching instructors:', error)
        return NextResponse.json(
            { error: 'Failed to fetch instructors' },
            { status: 500 }
        )
    }
}
