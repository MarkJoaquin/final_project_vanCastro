"use client"

import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { AlertDialogBooking } from '../AlertDialog/AlertDialog'
import { useState, useEffect } from 'react'
import { useLocalStorageWithExpiration } from '@/hooks/useLocalStorageWithExpiration'
import { Button } from "@/components/ui/button"
import type { PlanClass, Plan, FormData } from '@/types/FormTypes'


const BookingForm = () => {

    const form = useForm<FormData>({
        defaultValues: {
            licenseClass: '',
            plan: ''
        }
    })

    const { register, control, watch, reset } = form

    const [classes, setClasses] = useState<PlanClass[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const selectedClass = watch('licenseClass')
    const [showLearningPermitDialog, setShowLearningPermitDialog] = useState(false)
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const [learningPermitStatus, setLearningPermitStatus] = useLocalStorageWithExpiration('learningPermitAnswer', EXPIRATION_TIME)
    const [isFormDisabled, setIsFormDisabled] = useState(false)

    // Fetch classes from API
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('/api/classes')
                if (!response.ok) {
                    throw new Error('Failed to fetch classes')
                }
                const data = await response.json()
                setClasses(data)
            } catch (err) {
                setError('Failed to load license classes')
                console.error('Error loading classes:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchClasses()
    }, [])

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
            reset() // Reset the form when the user doesn't have a permit
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
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        I do have a Learning Permit
                    </Button>
                </div>
            )}
            <DevTool control={control} />
        </div>
    )
}

export default BookingForm
