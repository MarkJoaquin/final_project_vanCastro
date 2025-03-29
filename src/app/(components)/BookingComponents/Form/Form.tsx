"use client"

import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { AlertDialogBooking } from '../AlertDialog/AlertDialog'
import { useState, useEffect } from 'react'
import { useLocalStorageWithExpiration } from '@/hooks/useLocalStorageWithExpiration'
import { Button } from "@/components/ui/button"
import type { PlanClass, Plan, FormData } from '@/types/FormTypes'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const BookingForm = () => {
    const form = useForm<FormData>({
        defaultValues: {
            licenseClass: '',
            plan: '',
            instructor: '',
            location: '',
            dateTime: null
        }
    })

    const { register, control, watch, reset, formState: { errors }, setValue } = form

    const [classes, setClasses] = useState<PlanClass[]>([])
    const [instructors, setInstructors] = useState<any[]>([])
    const [locations, setLocations] = useState<any[]>([])
    const [availableTimes, setAvailableTimes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const selectedClass = watch('licenseClass')
    const selectedInstructor = watch('instructor')
    const selectedLocation = watch('location')
    const selectedDateTime = watch('dateTime')
    const [showLearningPermitDialog, setShowLearningPermitDialog] = useState(false)
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const [learningPermitStatus, setLearningPermitStatus] = useLocalStorageWithExpiration('learningPermitAnswer', EXPIRATION_TIME)
    const [isFormDisabled, setIsFormDisabled] = useState(false)

    // Fetch classes, instructors and locations from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, instructorsRes, locationsRes] = await Promise.all([
                    fetch('/api/classes'),
                    fetch('/api/instructors_for_form'),
                    fetch('/api/locations')
                ])

                if (!classesRes.ok || !instructorsRes.ok || !locationsRes.ok) {
                    throw new Error('Failed to fetch data')
                }

                const [classesData, instructorsData, locationsData] = await Promise.all([
                    classesRes.json(),
                    instructorsRes.json(),
                    locationsRes.json()
                ])

                setClasses(classesData)
                setInstructors(instructorsData)
                setLocations(locationsData)
            } catch (err) {
                setError('Failed to load data')
                console.error('Error loading data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Fetch instructor availability when instructor is selected
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedInstructor) {
                setAvailableTimes([])
                return
            }

            try {
                const response = await fetch(`/api/availability/${selectedInstructor}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch availability')
                }
                const data = await response.json()
                setAvailableTimes(data)
            } catch (err) {
                console.error('Error loading availability:', err)
                setError('Failed to load instructor availability')
            }
        }

        fetchAvailability()
    }, [selectedInstructor])

    // Helper function to check if a time is within instructor's availability
    const isTimeWithinAvailability = (time: Date) => {
        if (!availableTimes.length) return false

        const hours = time.getHours()
        const minutes = time.getMinutes()
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        return availableTimes.some(slot => {
            const start = slot.startTime
            const end = slot.endTime
            return timeString >= start && timeString <= end
        })
    }

    // Helper function to get available time intervals
    const getTimeIntervals = () => {
        if (!availableTimes.length) return []

        const intervals = []
        const currentSlot = availableTimes[0] // We'll use the first slot's times

        const [startHour, startMinute] = currentSlot.startTime.split(':').map(Number)
        const [endHour, endMinute] = currentSlot.endTime.split(':').map(Number)

        let currentTime = new Date()
        currentTime.setHours(startHour, startMinute, 0)

        const endTime = new Date()
        endTime.setHours(endHour, endMinute, 0)

        while (currentTime <= endTime) {
            intervals.push(new Date(currentTime))
            currentTime = new Date(currentTime.getTime() + 15 * 60000) // Add 15 minutes
        }

        return intervals
    }

    // Helper function to check if a date is a weekend
    const isWeekend = (date: Date) => {
        const day = date.getDay()
        return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
    }

    // Get the date 2 weeks from now
    const getStartDate = () => {
        const date = new Date()
        date.setDate(date.getDate() + 14) // Add 14 days
        
        // If it lands on a weekend, move to next Monday
        while (isWeekend(date)) {
            date.setDate(date.getDate() + 1)
        }
        
        return date
    }

    // Handle Class 7 validation
    useEffect(() => {
        if (!selectedClass || !classes.length) return;
        
        const selectedClassData = classes.find(c => c.id === selectedClass);
        if (selectedClassData?.name === 'Class 7') {
            if (learningPermitStatus === false) {
                setIsFormDisabled(true)
                reset()
            } else if (!showLearningPermitDialog && learningPermitStatus === null) {
                setShowLearningPermitDialog(true)
            }
        } else if (selectedClassData?.name !== 'Class 7' && showLearningPermitDialog) {
            setShowLearningPermitDialog(false)
        }
    }, [selectedClass, showLearningPermitDialog, learningPermitStatus, reset, classes])

    // Handle Learning Permit response
    const handlePermitResponse = (hasPermit: boolean) => {
        if (!hasPermit) {
            setIsFormDisabled(true)
            reset()
        }
    }

    // Handle Learning Permit status change
    const handleChangePermitStatus = () => {
        setLearningPermitStatus(true)
        setIsFormDisabled(false)
    }

    if (loading) return <div className="text-center">Loading...</div>
    if (error) return <div className="text-center text-red-500">{error}</div>

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
            <form className="w-full space-y-6">
                <div className={`bg-white shadow-sm rounded-lg p-6 ${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-6">Select Your License Class</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {classes.map((classOption) => (
                                <div key={classOption.id} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        {...register('licenseClass')}
                                        value={classOption.id}
                                        id={classOption.id}
                                        className="w-4 h-4"
                                        disabled={isFormDisabled}
                                    />
                                    <label htmlFor={classOption.id} className="flex-1 cursor-pointer">
                                        <div className="font-medium">{classOption.name}</div>
                                        <p className="text-sm text-gray-500">{classOption.description}</p>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {selectedClass && (
                            <>
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold">Select Your Plan</h3>
                                    <p className="text-sm text-gray-500 mb-4">* Taxes are not included in the price.</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        {classes.find(c => c.id === selectedClass)?.plans.map((plan) => (
                                            <div key={plan.id} className="border p-4 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    {...register('plan')}
                                                    value={plan.id}
                                                    id={plan.id}
                                                    className="hidden"
                                                />
                                                <label htmlFor={plan.id} className="flex justify-between items-center cursor-pointer">
                                                    <div>
                                                        <div className="font-medium">{plan.name}</div>
                                                        <p className="text-sm text-gray-500">{plan.description}</p>
                                                        <p className="text-sm text-gray-500">{plan.lessons} lessons, {plan.time} minutes each</p>
                                                    </div>
                                                    <div className="text-lg font-bold">${plan.price}</div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-4">Choose Your Instructor</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {instructors.map((instructor) => (
                                            <div key={instructor.id} 
                                                className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                                    selectedInstructor === instructor.id 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    {...register('instructor', { 
                                                        required: 'Please select an instructor'
                                                    })}
                                                    value={instructor.id}
                                                    id={`instructor-${instructor.id}`}
                                                    className="hidden"
                                                />
                                                {errors.instructor && (
                                                    <p className="text-sm text-red-500 mt-2 text-center">
                                                        {errors.instructor.message}
                                                    </p>
                                                )}
                                                <label 
                                                    htmlFor={`instructor-${instructor.id}`}
                                                    className="block cursor-pointer"
                                                >
                                                    <div className="relative w-full aspect-square mb-3">
                                                        <Image
                                                            src="/placeholder-instructor.jpg"
                                                            alt={instructor.name}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <h4 className="font-medium text-lg">{instructor.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {instructor.experienceYears} years experience
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap gap-1 justify-center">
                                                            {instructor.languages.map((lang: string) => (
                                                                <span 
                                                                    key={lang}
                                                                    className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                                                                >
                                                                    {lang}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-4">Select Location</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {locations.map((location) => (
                                            <div key={location.id} 
                                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                                    watch('location') === location.id 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    {...register('location', { 
                                                        required: 'Please select a location'
                                                    })}
                                                    value={location.id}
                                                    id={`location-${location.id}`}
                                                    className="hidden"
                                                />
                                                {errors.location && (
                                                    <p className="text-sm text-red-500 mt-2 text-center">
                                                        {errors.location.message}
                                                    </p>
                                                )}
                                                <label 
                                                    htmlFor={`location-${location.id}`}
                                                    className="block cursor-pointer"
                                                >
                                                    <div className="font-medium">{location.name}</div>
                                                    <p className="text-sm text-gray-500">{location.address}</p>
                                                    <div className="text-sm text-gray-500">
                                                        {location.city}, {location.zip}
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedLocation && selectedInstructor && (
                                    <div className="mt-6">
                                        <h3 className="text-xl font-semibold mb-4">Select Date and Time</h3>
                                        <div className="space-y-4">
                                            <DatePicker
                                                selected={selectedDateTime}
                                                onChange={(date) => setValue('dateTime', date)}
                                                showTimeSelect
                                                inline
                                                minDate={getStartDate()}
                                                maxDate={new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)} // 120 days ahead
                                                timeIntervals={15}
                                                includeTimes={getTimeIntervals()}
                                                filterTime={isTimeWithinAvailability}
                                                filterDate={(date) => !isWeekend(date)}
                                                timeFormat="HH:mm"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                className="w-full"
                                            />
                                            {errors.dateTime && (
                                                <p className="text-sm text-red-500 text-center">
                                                    {errors.dateTime.message}
                                                </p>
                                            )}
                                            {availableTimes.length === 0 && (
                                                <p className="text-sm text-gray-500 text-center">
                                                    No available time slots for the selected instructor
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </form>
            {showLearningPermitDialog && (
                <AlertDialogBooking onPermitResponse={handlePermitResponse} />
            )}
            {isFormDisabled && (
                <div className="mt-4 space-y-4">
                    <div className="p-4 bg-red-100 text-red-700 rounded-md">
                        You need a Learning Permit to proceed with booking driving lessons.
                    </div>
                    <Button
                        onClick={handleChangePermitStatus}
                        className="w-full"
                    >
                        I now have my Learning Permit
                    </Button>
                </div>
            )}
            <DevTool control={control} />
        </div>
    )
}

export default BookingForm
