"use client"

import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { AlertDialogBooking } from '../AlertDialog/AlertDialog'
import { useState, useEffect } from 'react'
import { useLocalStorageWithExpiration } from '@/hooks/useLocalStorageWithExpiration'
import { Button } from "@/components/ui/button"

type FormData = {
    licenseClass: string;
}

const BookingForm = () => {
    const { register, control, watch, reset } = useForm<FormData>({
        defaultValues: {
            licenseClass: ''
        }
    })
    const selectedClass = watch('licenseClass')
    const [showLearningPermitDialog, setShowLearningPermitDialog] = useState(false)
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const [learningPermitStatus, setLearningPermitStatus] = useLocalStorageWithExpiration('learningPermitAnswer', EXPIRATION_TIME)
    const [isFormDisabled, setIsFormDisabled] = useState(false)

    // Observar cambios en la clase seleccionada
    useEffect(() => {
        if (selectedClass === 'class7') {
            if (learningPermitStatus === false) {
                setIsFormDisabled(true)
                reset() // Resetear el formulario
            } else if (!showLearningPermitDialog && learningPermitStatus === null) {
                setShowLearningPermitDialog(true)
            }
        } else if (selectedClass !== 'class7' && showLearningPermitDialog) {
            setShowLearningPermitDialog(false)
        }
    }, [selectedClass, showLearningPermitDialog, learningPermitStatus, reset])

    const handlePermitResponse = (hasPermit: boolean) => {
        if (!hasPermit) {
            setIsFormDisabled(true)
            reset() // Resetear el formulario cuando el usuario no tiene permiso
        }
    }

    const handleChangePermitStatus = () => {
        setLearningPermitStatus(true)
        setIsFormDisabled(false)
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
            <form className="w-full space-y-6">
                <div className={`bg-white shadow-sm rounded-lg p-6 ${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-6">Select Your License Class</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    id: 'class7',
                                    title: 'Class 7 - Novice Driver',
                                    description: 'For new drivers starting their journey'
                                },
                                {
                                    id: 'class5',
                                    title: 'Class 5 - Regular Driver',
                                    description: 'Standard passenger vehicle license'
                                },
                                {
                                    id: 'class4',
                                    title: 'Class 4 - Commercial',
                                    description: 'Taxi, ambulance, and small buses'
                                }
                            ].map((option) => (
                                <div key={option.id} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        {...register('licenseClass')}
                                        value={option.id}
                                        id={option.id}
                                        className="w-4 h-4"
                                        disabled={isFormDisabled}
                                    />
                                    <label htmlFor={option.id} className="flex-1 cursor-pointer">
                                        <div className="font-medium">{option.title}</div>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
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
