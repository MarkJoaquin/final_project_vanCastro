"use client"

import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { AlertDialogBooking } from '../AlertDialog/AlertDialog'
import { useState, useEffect } from 'react'
import { useLocalStorageWithExpiration } from '@/hooks/useLocalStorageWithExpiration'
import { Button } from "@/components/ui/button"
import type { PlanClass, Plan, FormData, Location } from '@/types/FormTypes'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import "./calendar-styles.css" // Importar estilos personalizados del calendario
import { countries } from '@/data/countries'
import { icbcLocations } from '@/data/icbcLocations'

const BookingForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            console.log('Form submitted with data:', data);

            const response = await fetch('/api/lessons/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al enviar la solicitud');
            }

            setSubmitSuccess(true);
            setTrackingNumber(result.trackingNumber);
            console.log('Solicitud creada exitosamente:', result);

            // Opcional: resetear el formulario después de un envío exitoso
            // reset();

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setSubmitError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
            reset();
        }
    };

    const form = useForm<FormData>({
        defaultValues: {
            // Datos personales
            firstName: '',
            lastName: '',
            birthDate: null,
            country: '',
            phone: '',
            email: '',

            // Información de licencia
            hasDriverLicense: '',
            licenseNumber: '',
            licenseType: '',
            licenseExpiryDate: null,

            // Información de road test
            hasBookedRoadTest: '',
            roadTestLocation: '',

            // Selección de lección
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
    const [locations, setLocations] = useState<Location[]>([])
    const [availableTimes, setAvailableTimes] = useState<any[]>([])
    const [unavailableTimeSlots, setUnavailableTimeSlots] = useState<any[]>([])
    const [validatingTimeSlot, setValidatingTimeSlot] = useState(false)
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // Campos observados para los detalles de la lección
    const selectedClass = watch('licenseClass')
    const selectedPlan = watch('plan')
    const selectedInstructor = watch('instructor')
    const selectedLocation = watch('location')
    const selectedDateTime = watch('dateTime')

    // Campos observados para licencia y road test
    const hasDriverLicense = watch('hasDriverLicense')
    const hasBookedRoadTest = watch('hasBookedRoadTest')
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

    /* 
    // Establecer fecha por defecto al cargar el componente
    useEffect(() => {
        // Establecer la fecha por defecto solo una vez al iniciar
        const startDate = getStartDate()
        setSelectedDate(startDate)
        
        // Opcional: pre-seleccionar una hora por defecto (por ejemplo, 10:00 AM)
        const defaultDateTime = new Date(startDate)
        // defaultDateTime.setHours(0, 0, 0, 0) // 10:00 AM 
        setValue('dateTime', defaultDateTime)
    }, []) // Ejecutar solo al montar el componente
    */

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

                // Solo inicializar la fecha si no hay una fecha seleccionada previamente
                if (!selectedDate && !selectedDateTime) {
                    const startDate = getStartDate()
                    // console.log('Selected date:', startDate)
                    setSelectedDate(startDate)
                }
            } catch (err) {
                console.error('Error loading availability:', err)
                setError('Failed to load instructor availability')
            }
        }

        fetchAvailability()
    }, [selectedInstructor])

    // Fetch unavailable time slots when date or instructor changes
    useEffect(() => {
        const fetchUnavailableSlots = async () => {
            if (!selectedInstructor || !selectedDate) {
                return
            }

            try {
                const formattedDate = selectedDate.toISOString().split('T')[0]

                /* console.log('Consultando slots no disponibles para:', {
                    instructorId: selectedInstructor,
                    date: formattedDate
                }) */

                const response = await fetch(`/api/lessons/unavailable?instructorId=${selectedInstructor}&date=${formattedDate}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch unavailable time slots')
                }

                const data = await response.json()
                console.log('Slots no disponibles recibidos desde frontend:', data)
                setUnavailableTimeSlots(data)
            } catch (err) {
                console.error('Error loading unavailable time slots:', err)
            }
        }

        fetchUnavailableSlots()
    }, [selectedInstructor, selectedDate])

    // También inicializamos la fecha seleccionada cuando el componente se monta
    useEffect(() => {
        // Establecer la fecha inicial como la fecha de inicio (2 semanas en el futuro)
        const startDate = getStartDate()
        setSelectedDate(startDate)
    }, [])

    // Validate time slot against existing lessons when date/time is selected
    useEffect(() => {
        const validateTimeSlot = async () => {
            if (!selectedDateTime || !selectedInstructor || !selectedPlan) {
                return
            }

            setValidatingTimeSlot(true)
            setTimeSlotError(null)

            try {
                const hours = selectedDateTime.getHours()
                const minutes = selectedDateTime.getMinutes()
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

                // Preparar los datos para la validación
                const validationData: {
                    instructorId: string,
                    lessonDate: string,
                    lessonTime: string,
                    planId: string,
                    locationId?: string  // Hacemos locationId opcional con '?'
                } = {
                    instructorId: selectedInstructor,
                    lessonDate: selectedDateTime.toISOString(),
                    lessonTime: timeString,
                    planId: selectedPlan
                }

                // Si hay una ubicación seleccionada, incluirla para la validación de tiempo de tránsito
                if (selectedLocation) {
                    validationData.locationId = selectedLocation
                }

                const response = await fetch('/api/lessons/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(validationData),
                })

                const data = await response.json()

                if (!data.isAvailable) {
                    setTimeSlotError(data.message || 'This time slot is not available')
                    setValue('dateTime', null)
                }
            } catch (err) {
                console.error('Error validating time slot:', err)
                setTimeSlotError('Failed to validate time slot availability')
            } finally {
                setValidatingTimeSlot(false)
            }
        }

        validateTimeSlot()
    }, [selectedDateTime, selectedInstructor, selectedPlan, setValue, selectedLocation])

    // Función de filtrado para el DatePicker
    const filterTime = (time: Date) => {
        const hours = time.getHours()
        const minutes = time.getMinutes()
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        // Obtener la fecha del DatePicker en formato YYYY-MM-DD
        const datePickerDate = selectedDate ? selectedDate.toISOString().split('T')[0] : ''

        /* console.log('Verificando slots no disponibles para:', datePickerDate, timeString) */

        // Verificar si el slot está marcado como no disponible
        const isUnavailable = unavailableTimeSlots.some(slot => {
            // Asegurarnos de que el slot tenga una fecha válida
            if (!slot.date) {
                console.error('Slot sin fecha definida:', slot)
                return false
            }

            // Convertir la fecha del slot a formato YYYY-MM-DD
            const slotDate = new Date(slot.date).toISOString().split('T')[0]

            // Solo considerar slots de la fecha seleccionada en el DatePicker
            if (slotDate !== datePickerDate) {
                /* console.log(`Ignorando slot de fecha ${slotDate} (buscando ${datePickerDate})`) */
                return false
            }

            // Verificar que tenga tiempos de inicio y fin
            if (!slot.startTime || !slot.endTime) {
                console.error('Slot sin tiempos definidos:', slot)
                return false
            }

            const [startHour, startMinute] = slot.startTime.split(':').map(Number)
            const [endHour, endMinute] = slot.endTime.split(':').map(Number)

            const timeInMinutes = hours * 60 + minutes
            const startInMinutes = startHour * 60 + startMinute
            const endInMinutes = endHour * 60 + endMinute

            /* console.log(`Evaluando: ${timeString} contra lección ${slot.startTime}-${slot.endTime}`, {
                timeInMinutes,
                startInMinutes,
                endInMinutes,
                resultado: timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes
            }) */

            // Bloquear completamente el slot, incluyendo el tiempo de finalización
            return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes
        })
        return !isUnavailable
    }

    // Validar disponibilidad
    /* const isTimeWithinAvailability = (time: Date) => {
        const hours = time.getHours()
        const minutes = time.getMinutes()
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        // Verificar disponibilidad del instructor
        const isAvailable = availableTimes.some(slot => {
            return timeString >= slot.startTime && timeString <= slot.endTime
        })

        return isAvailable
    } */

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

    // Helper function to check if a datetime has valid time (not 00:00:00)
    const hasValidTime = (date: Date | null) => {
        if (!date) return false
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return hours !== 0 || minutes !== 0
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
                    <div className="space-y-8">
                        {/* Sección de información personal */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        {...register('firstName', { required: 'First name is required' })}
                                        className="w-full p-2 border rounded-md"
                                        disabled={isFormDisabled}
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>

                                {/* Apellido */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        {...register('lastName', { required: 'Last name is required' })}
                                        className="w-full p-2 border rounded-md"
                                        disabled={isFormDisabled}
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>

                                {/* Fecha de nacimiento */}
                                <div>
                                    <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                                        Date of Birth
                                    </label>
                                    <Controller
                                        control={control}
                                        name="birthDate"
                                        rules={{ required: 'Date of birth is required' }}
                                        render={({ field }) => (
                                            <DatePicker
                                                id="birthDate"
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                dateFormat="MMMM d, yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                className="w-full p-2 border rounded-md"
                                                placeholderText="Select your date of birth"
                                                maxDate={new Date()}
                                                disabled={isFormDisabled}
                                            />
                                        )}
                                    />
                                    {errors.birthDate && (
                                        <p className="text-sm text-red-500 mt-1">{errors.birthDate.message}</p>
                                    )}
                                </div>

                                {/* País */}
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium mb-2">
                                        Where are you from?
                                    </label>
                                    <select
                                        id="country"
                                        {...register('country', { required: 'Country is required' })}
                                        className="w-full p-2 border rounded-md"
                                        disabled={isFormDisabled}
                                    >
                                        <option value="">Select your country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && (
                                        <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[0-9+\-\s()]*$/,
                                                message: 'Please enter a valid phone number'
                                            }
                                        })}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="+1 (123) 456-7890"
                                        disabled={isFormDisabled}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Please enter a valid email address'
                                            }
                                        })}
                                        className="w-full p-2 border rounded-md"
                                        disabled={isFormDisabled}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sección de información de licencia */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">Driver License Information</h2>
                            <div>
                                <p className="block text-sm font-medium mb-3">Do you have a driver license?</p>
                                <div className="flex space-x-6 mb-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="no"
                                            {...register('hasDriverLicense', { required: 'Please select an option' })}
                                            className="h-4 w-4"
                                            disabled={isFormDisabled}
                                        />
                                        <span>No</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="yes"
                                            {...register('hasDriverLicense', { required: 'Please select an option' })}
                                            className="h-4 w-4"
                                            disabled={isFormDisabled}
                                        />
                                        <span>Yes</span>
                                    </label>
                                </div>
                                {errors.hasDriverLicense && (
                                    <p className="text-sm text-red-500 mt-1">{errors.hasDriverLicense.message}</p>
                                )}
                            </div>

                            {/* Campos adicionales si tiene licencia */}
                            {hasDriverLicense === 'yes' && (
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="licenseNumber" className="block text-sm font-medium mb-2">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            id="licenseNumber"
                                            {...register('licenseNumber', {
                                                required: 'License number is required'
                                            })}
                                            className="w-full p-2 border rounded-md"
                                            disabled={isFormDisabled}
                                        />
                                        {errors.licenseNumber && (
                                            <p className="text-sm text-red-500 mt-1">{errors.licenseNumber.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="licenseType" className="block text-sm font-medium mb-2">
                                            License Type
                                        </label>
                                        <input
                                            type="text"
                                            id="licenseType"
                                            {...register('licenseType', {
                                                required: 'License type is required'
                                            })}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g. Class 7, Class 5"
                                            disabled={isFormDisabled}
                                        />
                                        {errors.licenseType && (
                                            <p className="text-sm text-red-500 mt-1">{errors.licenseType.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="licenseExpiryDate" className="block text-sm font-medium mb-2">
                                            Expiry Date
                                        </label>
                                        <Controller
                                            control={control}
                                            name="licenseExpiryDate"
                                            rules={{ required: 'Expiry date is required' }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    id="licenseExpiryDate"
                                                    selected={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="w-full p-2 border rounded-md"
                                                    placeholderText="Select expiry date"
                                                    minDate={new Date()}
                                                    disabled={isFormDisabled}
                                                />
                                            )}
                                        />
                                        {errors.licenseExpiryDate && (
                                            <p className="text-sm text-red-500 mt-1">{errors.licenseExpiryDate.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sección de información de road test */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-6">Road Test Information</h2>
                            <div>
                                <p className="block text-sm font-medium mb-3">Have you booked your road test already?</p>
                                <div className="flex space-x-6 mb-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="no"
                                            {...register('hasBookedRoadTest', { required: 'Please select an option' })}
                                            className="h-4 w-4"
                                            disabled={isFormDisabled}
                                        />
                                        <span>No</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="yes"
                                            {...register('hasBookedRoadTest', { required: 'Please select an option' })}
                                            className="h-4 w-4"
                                            disabled={isFormDisabled}
                                        />
                                        <span>Yes</span>
                                    </label>
                                </div>
                                {errors.hasBookedRoadTest && (
                                    <p className="text-sm text-red-500 mt-1">{errors.hasBookedRoadTest.message}</p>
                                )}
                            </div>

                            {/* Campo adicional si ha reservado road test */}
                            {hasBookedRoadTest === 'yes' && (
                                <div>
                                    <label htmlFor="roadTestLocation" className="block text-sm font-medium mb-2">
                                        ICBC Location
                                    </label>
                                    <select
                                        id="roadTestLocation"
                                        {...register('roadTestLocation', { required: 'ICBC location is required' })}
                                        className="w-full p-2 border rounded-md"
                                        disabled={isFormDisabled}
                                    >
                                        <option value="">Select ICBC location</option>
                                        {icbcLocations.map((location) => (
                                            <option key={location} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.roadTestLocation && (
                                        <p className="text-sm text-red-500 mt-1">{errors.roadTestLocation.message}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sección de selección de clase de licencia */}
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
                                            <div key={plan.id} className={`border p-4 rounded-lg hover:bg-gray-50 ${selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                                                <input
                                                    type="radio"
                                                    {...register('plan', { required: 'Please select a plan' })}
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
                                        {instructors.map((instructor, index) => (
                                            <div key={instructor.id}
                                                className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedInstructor === instructor.id
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
                                                            src={`/instructor${index}.png`}
                                                            alt={instructor.name}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <h4 className="font-medium text-lg">{instructor.name}</h4>
                                                        {/*  <p className="text-sm text-gray-500">
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
                                                        </div> */}
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-4">Choose Your Location</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {locations.map((location) => (
                                            <div key={location.id}
                                                className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedLocation === location.id
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
                                                    {/* <p className="text-sm text-gray-500">{location.address}</p>
                                                    <div className="text-sm text-gray-500">
                                                        {location.city}, {location.zip}
                                                    </div> */}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedLocation && selectedInstructor && selectedPlan && (
                                    <div className="mt-6">
                                       {/*  <h3 className="text-xl font-semibold mb-4">Select Date</h3> */}
                                        
                                        {/* Contenedor flexible para calendario y horas */}
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Columna del calendario */}
                                            <div className="md:w-7/12">
                                                <h4 className="text-lg font-medium mb-3">Pick a Date</h4>
                                                <div className="calendar-container">
                                                    <DatePicker
                                                        selected={selectedDateTime || selectedDate}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                // Establecer solo la fecha, manteniendo la hora en 00:00
                                                                const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                                                                setSelectedDate(dateOnly)
                                                            }
                                                        }}
                                                        onMonthChange={(date) => {
                                                            // When month changes, update selected date
                                                            const dateOnly = new Date(date)
                                                            dateOnly.setHours(0, 0, 0, 0)
                                                            setSelectedDate(dateOnly)
                                                        }}
                                                        inline
                                                        minDate={getStartDate()}
                                                        maxDate={new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)} // 120 days ahead
                                                        filterDate={(date) => !isWeekend(date)}
                                                        dateFormat="MMMM d, yyyy"
                                                        className="w-full"
                                                        calendarClassName="custom-calendar"
                                                        // Deshabilitar selector de hora en este componente
                                                        showTimeSelect={false}
                                                        // Personalizar la navegación del calendario
                                                        previousMonthButtonLabel="‹"
                                                        nextMonthButtonLabel="›"
                                                        // Usar el formato de mes y año predeterminado
                                                        monthsShown={1}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Columna de horas con scroll */}
                                            <div className="md:w-5/12">
                                                {selectedDate ? (
                                                    <div>
                                                        <h4 className="text-lg font-medium mb-3">Available Times</h4>
                                                        <div className="h-64 overflow-y-auto pr-2 border rounded-md p-3 bg-white shadow-sm">
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                                {getTimeIntervals().map((time, index) => {
                                                                    const isAvailable = filterTime(time);
                                                                    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
                                                                    const isSelected = selectedDateTime && 
                                                                        selectedDateTime.getHours() === time.getHours() && 
                                                                        selectedDateTime.getMinutes() === time.getMinutes();
                                                                    
                                                                    return (
                                                                        <button
                                                                            key={index}
                                                                            type="button"
                                                                            disabled={!isAvailable}
                                                                            className={`py-2 px-3 rounded-md text-sm ${isSelected 
                                                                                ? 'bg-blue-500 text-white' 
                                                                                : isAvailable 
                                                                                    ? 'bg-white border hover:bg-gray-50 cursor-pointer' 
                                                                                    : 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'}`}
                                                                            onClick={() => {
                                                                                if (isAvailable && selectedDate) {
                                                                                    const newDateTime = new Date(selectedDate);
                                                                                    newDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
                                                                                    setValue('dateTime', newDateTime);
                                                                                }
                                                                            }}
                                                                        >
                                                                            {timeString}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-64 border rounded-md">
                                                        <p className="text-gray-500">Please select a date first</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Mensajes de estado debajo del calendario y las horas */}
                                        <div className="mt-4">
                                            {errors.dateTime && (
                                                <p className="text-sm text-red-500 text-center">
                                                    {errors.dateTime.message}
                                                </p>
                                            )}
                                            {timeSlotError && (
                                                <p className="text-sm text-red-500 text-center">
                                                    {timeSlotError}
                                                </p>
                                            )}
                                            {validatingTimeSlot && (
                                                <p className="text-sm text-blue-500 text-center">
                                                    Validating time slot availability...
                                                </p>
                                            )}
                                            {selectedDate && availableTimes.length === 0 && (
                                                <p className="text-sm text-gray-500 text-center">
                                                    No available time slots for the selected instructor on this date
                                                </p>
                                            )}
                                            {selectedDateTime && (
                                                <p className="text-sm text-green-500 text-center mt-2">
                                                    You selected: {selectedDateTime.toLocaleString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {/* Submit Button */}
                <div className="mt-8 flex justify-center relative">
                    <Button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer"
                        disabled={isSubmitting || isFormDisabled || validatingTimeSlot || !selectedDateTime || !selectedPlan || !selectedLocation || !hasValidTime(selectedDateTime)}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                    </Button>
                    {/* {selectedDateTime && !hasValidTime(selectedDateTime) && (
                        <p className="text-sm text-red-500 mt-2 absolute -bottom-6 whitespace-nowrap">
                            Por favor selecciona una hora específica, no solo la fecha
                        </p>
                    )} */}
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
