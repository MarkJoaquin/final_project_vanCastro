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
                id: true,
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

export async function PUT(
    request: NextRequest,
    context: { params: { instructorId: string } }
) {
    try {
        const params = await context.params
        const instructorId = params.instructorId
        const { startTime, endTime } = await request.json()

        // Validación básica
        if (!startTime || !endTime) {
            return NextResponse.json({ error: 'Start time and end time are required' }, { status: 400 })
        }

        // Validar formato de hora (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return NextResponse.json({ error: 'Invalid time format. Use HH:MM format.' }, { status: 400 })
        }

        // Validar que la hora de inicio sea anterior a la hora de fin
        if (startTime >= endTime) {
            return NextResponse.json({ error: 'Start time must be before end time' }, { status: 400 })
        }

        // Buscar si ya existe un registro de disponibilidad para este instructor
        const existingAvailability = await prisma.availability.findFirst({
            where: {
                instructorId: instructorId
            }
        })

        let availability

        if (existingAvailability) {
            // Actualizar el registro existente
            availability = await prisma.availability.update({
                where: {
                    id: existingAvailability.id
                },
                data: {
                    startTime,
                    endTime
                }
            })
        } else {
            // Crear un nuevo registro
            availability = await prisma.availability.create({
                data: {
                    instructorId,
                    startTime,
                    endTime
                }
            })
        }

        return NextResponse.json(availability)
    } catch (error) {
        console.error('Error updating availability:', error)
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
    }
}
