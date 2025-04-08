import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                zip: true,
            }
        })
        return NextResponse.json(locations)
    } catch (error) {
        console.error('Error fetching locations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch locations' },
            { status: 500 }
        )
    }
}
