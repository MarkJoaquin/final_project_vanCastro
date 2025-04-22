"use client"

import { useState, useEffect } from 'react'
import { useAdminDataContext } from '@/app/(context)/adminContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-hot-toast'

export default function AvailabilitySettings() {
    const { loginedInstructorData } = useAdminDataContext()
    const [startTime, setStartTime] = useState<string>('08:00')
    const [endTime, setEndTime] = useState<string>('18:00')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    useEffect(() => {
        if (loginedInstructorData?.id) {
            fetchAvailability()
        }
    }, [loginedInstructorData])

    const fetchAvailability = async () => {
        if (!loginedInstructorData?.id) return
        
        setIsLoading(true)
        try {
            const response = await fetch(`/api/availability/${loginedInstructorData.id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch availability')
            }
            
            const data = await response.json()
            if (data && data.length > 0) {
                setStartTime(data[0].startTime)
                setEndTime(data[0].endTime)
            }
        } catch (error) {
            console.error('Error fetching availability:', error)
            toast.error('Failed to load availability settings')
        } finally {
            setIsLoading(false)
        }
    }

    const saveAvailability = async () => {
        if (!loginedInstructorData?.id) {
            toast.error('Instructor ID not found')
            return
        }
        
        // Validación básica
        if (!startTime || !endTime) {
            toast.error('Start time and end time are required')
            return
        }
        
        // Validar formato de hora (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            toast.error('Invalid time format. Use HH:MM format.')
            return
        }
        
        // Validar que la hora de inicio sea anterior a la hora de fin
        if (startTime >= endTime) {
            toast.error('Start time must be before end time')
            return
        }
        
        setIsSaving(true)
        try {
            const response = await fetch(`/api/availability/${loginedInstructorData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startTime,
                    endTime
                }),
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update availability')
            }
            
            toast.success('Availability updated successfully')
        } catch (error) {
            console.error('Error updating availability:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to update availability')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Lesson Availability</CardTitle>
                <CardDescription>
                    Change your business hours based on the season
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="startTime" className="block text-sm font-medium mb-2">
                            Start Time
                        </Label>
                        <Input
                            id="startTime"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full"
                            disabled={isLoading || isSaving}
                        />
                    </div>
                    <div>
                        <Label htmlFor="endTime" className="block text-sm font-medium mb-2">
                            End Time
                        </Label>
                        <Input
                            id="endTime"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full"
                            disabled={isLoading || isSaving}
                        />
                    </div>
                </div>
                <Button 
                    onClick={saveAvailability} 
                    className="mt-6 bg-[var(--primary-color)] text-black font-bold hover:text-white cursor-pointer"
                    disabled={isLoading || isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardContent>
        </Card>
    )
}
