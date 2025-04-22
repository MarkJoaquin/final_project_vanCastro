"use client"

import { useForm, Controller } from 'react-hook-form'
// Comentamos DevTool para evitar errores
// import { DevTool } from '@hookform/devtools'
import { AlertDialogBooking } from '../AlertDialog/AlertDialog'
import { useState, useEffect } from 'react'
import { useLocalStorageWithExpiration } from '@/hooks/useLocalStorageWithExpiration'
import { Button } from "@/components/ui/button"
import type { PlanClass, Plan, FormData, Location } from '@/types/FormTypes'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import "./calendar-styles.css" // Importar estilos personalizados del calendario
// import { countries } from '@/data/countries'
import { icbcLocations } from '@/data/icbcLocations'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import LocationDropdown from '../LocationDropdown/LocationDropdown'
import { FaMapMarkerAlt } from 'react-icons/fa'
// Eliminamos la importación de InputMask que causa problemas

const BookingForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [currentPrices, setCurrentPrices] = useState<{ subtotal: number, gst: number, total: number, singleLessonPrice: string | null }>(
        { subtotal: 0, gst: 0, total: 0, singleLessonPrice: null }
    );

    // Function to handle back button click and reset the form
    const handleBackButtonClick = () => {
        setSubmitSuccess(false);
        setTrackingNumber(null);
        reset();
    };

    // Función para subir la imagen del learner permit
    const uploadLearnerPermitImage = async (email: string): Promise<string | null> => {
        if (!learnerPermitImage) return null;
        
        try {
            const imageFormData = new FormData();
            imageFormData.append('file', learnerPermitImage);
            imageFormData.append('email', email);
            
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: imageFormData,
            });
            
            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }
            
            const result = await response.json();
            console.log('Imagen subida exitosamente:', result);
            
            return result.fileUrl;
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            throw error;
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            console.log('Form submitted with data:', data);
            
            let formData = data;
            let permitUrl = null;
            
            // Si el usuario no tiene licencia pero tiene learner permit, subir la imagen
            if (hasDriverLicense === 'no' && hasLearnerPermit === 'yes' && learnerPermitImage) {
                try {
                    permitUrl = await uploadLearnerPermitImage(data.email);
                    setLearnerPermitImageUrl(permitUrl);
                    
                    // Incluir la URL de la imagen en los datos del formulario
                    // y también en el campo learnerPermitUrl para que el backend
                    // pueda guardarlo en el modelo Student
                    formData = {
                        ...data,
                        learnerPermitImage: permitUrl,
                        // Verificar que permitUrl no sea null antes de asignarlo
                        ...(permitUrl ? { learnerPermitUrl: permitUrl } : {})
                    };
                } catch (error) {
                    console.error('Error al subir la imagen del learner permit:', error);
                    setSubmitError('Error al subir la imagen. Por favor intente nuevamente.');
                    setIsSubmitting(false);
                    return;
                }
            }

            const response = await fetch('/api/lessons/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al enviar la solicitud');
            }

            // Capture the selected location object before resetting the form
            setBookingLocation(locations.find(loc => loc.id === data.location) || null);
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
            // Removed birthDate and country fields
            phone: '',
            email: '',

            // Información de licencia
            hasDriverLicense: '',
            licenseNumber: '',
            licenseType: '',
            licenseExpiryDate: null,

            // Información de learner permit
            hasLearnerPermit: '',
            learnerPermitImage: '',

            // Selección de lección
            licenseClass: '',
            plan: '',
            instructor: '',
            location: '',
            dateTime: null,
            
            // Método de pago
            paymentMethod: ''
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
    const [bookingLocation, setBookingLocation] = useState<Location | null>(null)

    // Campos observados para los detalles de la lección
    const selectedClass = watch('licenseClass')
    const selectedPlan = watch('plan')
    const selectedInstructor = watch('instructor')
    const selectedLocation = watch('location')
    const selectedDateTime = watch('dateTime')
    const selectedPaymentMethod = watch('paymentMethod')

    // Campos observados para licencia y road test
    const hasDriverLicense = watch('hasDriverLicense')
    const hasLearnerPermit = watch('hasLearnerPermit')
    const [showLearningPermitDialog, setShowLearningPermitDialog] = useState(false)
    const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const [learningPermitStatus, setLearningPermitStatus] = useLocalStorageWithExpiration('learningPermitAnswer', EXPIRATION_TIME)
    const [isFormDisabled, setIsFormDisabled] = useState(false)
    const [learnerPermitImage, setLearnerPermitImage] = useState<File | null>(null)
    const [learnerPermitImageUrl, setLearnerPermitImageUrl] = useState<string | null>(null)

    // Removed currentLocation derived from watch; using bookingLocation state instead

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
            if (!selectedDateTime || !selectedInstructor || !selectedPlan || !selectedLocation) {
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
                    locationId: string  // Ahora locationId es obligatorio
                } = {
                    instructorId: selectedInstructor,
                    lessonDate: selectedDateTime.toISOString(),
                    lessonTime: timeString,
                    planId: selectedPlan,
                    locationId: selectedLocation // Siempre incluimos la ubicación
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

    // Manejar el cambio de estado del Learner Permit
    const handleChangePermitStatus = () => {
        setLearningPermitStatus(true)
        setIsFormDisabled(false)
    }
    
    // Deshabilitar formulario si el usuario no tiene licencia ni learner permit
    useEffect(() => {
        if (hasDriverLicense === 'no' && hasLearnerPermit === 'no') {
            setIsFormDisabled(true);
        } else if (hasDriverLicense === 'yes' || hasLearnerPermit === 'yes') {
            setIsFormDisabled(false);
        }
    }, [hasDriverLicense, hasLearnerPermit])

    if (loading) return <div className="text-center">Loading...</div>
    if (error) return <div className="text-center text-red-500">{error}</div>

    return (
        <div className="mx-auto p-4 md:p-8 bg-white rounded-lg shadow-md max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Book a Driving Lesson</h2>

            {submitSuccess && trackingNumber ? (
                <div className="my-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-green-700 mb-2">Booking Successful!</h3>
                    <p className="mb-4">Your request has been sent and is being processed.</p>
                    <div className="bg-white p-4 rounded-md inline-block mb-4">
                        <p className="text-sm text-gray-600">Tracking Number:</p>
                        <p className="text-2xl font-mono font-bold tracking-wider">{trackingNumber}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-4 justify-center">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${bookingLocation?.address}, ${bookingLocation?.city}, ${bookingLocation?.zip}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {`${bookingLocation?.address}, ${bookingLocation?.city}, ${bookingLocation?.zip}`}
                        </a>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                        Save this number to check the status of your reservation. We will send you an email with the details.
                    </p>
                    <Button 
                        type="button" 
                        onClick={handleBackButtonClick}
                        variant="outline"
                        className="mt-4"
                    >
                        Back
                    </Button>
                </div>
            ) : (
                <>
                <form onSubmit={form.handleSubmit((data) => {
                    setShowConfirmation(true);
                })} className="space-y-8">
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
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
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
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                        disabled={isFormDisabled}
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{
                                            required: 'Phone number is required',
                                            validate: value => {
                                                // Verificar que el número tenga 10 dígitos (formato canadiense)
                                                const digitsOnly = value.replace(/\D/g, '');
                                                return digitsOnly.length === 10 || 'Canadian phone numbers must have exactly 10 digits';
                                            }
                                        }}
                                        render={({ field }) => (
                                            <input
                                                type="tel"
                                                id="phone"
                                                inputMode="numeric"
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                    // Obtener solo los dígitos
                                                    let digits = e.target.value.replace(/\D/g, '');
                                                    
                                                    // Limitar a 10 dígitos
                                                    digits = digits.substring(0, 10);
                                                    
                                                    // Formatear como número canadiense
                                                    let formattedValue = '';
                                                    if (digits.length > 0) {
                                                        formattedValue = '(' + digits.substring(0, Math.min(3, digits.length));
                                                        if (digits.length > 3) {
                                                            formattedValue += ') ' + digits.substring(3, Math.min(6, digits.length));
                                                            if (digits.length > 6) {
                                                                formattedValue += '-' + digits.substring(6, 10);
                                                            }
                                                        }
                                                    }
                                                    
                                                    // Actualizar el valor en el formulario
                                                    field.onChange(formattedValue);
                                                }}
                                                onKeyDown={e => {
                                                    // Permitir teclas de navegación y borrado
                                                    if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onPaste={e => {
                                                    e.preventDefault();
                                                    const paste = e.clipboardData.getData('Text').replace(/\D/g, '').substring(0, 10);
                                                    
                                                    // Formatear el texto pegado
                                                    let formattedValue = '';
                                                    if (paste.length > 0) {
                                                        formattedValue = '(' + paste.substring(0, Math.min(3, paste.length));
                                                        if (paste.length > 3) {
                                                            formattedValue += ') ' + paste.substring(3, Math.min(6, paste.length));
                                                            if (paste.length > 6) {
                                                                formattedValue += '-' + paste.substring(6, 10);
                                                            }
                                                        }
                                                    }
                                                    
                                                    field.onChange(formattedValue);
                                                }}
                                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                                placeholder="(604) 123-4567"
                                                disabled={isFormDisabled}
                                            />
                                        )}
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
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
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
                                        <Controller
                                            name="licenseNumber"
                                            control={control}
                                            rules={{
                                                required: 'License number is required',
                                                pattern: {
                                                    // Patrón para números de licencia canadienses (alfanuméricos)
                                                    value: /^[A-Za-z0-9-]{1,15}$/,
                                                    message: 'Please enter a valid Canadian license number'
                                                }
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    type="text"
                                                    id="licenseNumber"
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Convertir a mayúsculas y limitar a 15 caracteres
                                                        const value = e.target.value.toUpperCase().slice(0, 15);
                                                        field.onChange(value);
                                                    }}
                                                    onKeyDown={e => {
                                                        // Permitir letras, números, guión y teclas de navegación
                                                        const validKeys = /[A-Za-z0-9-]/.test(e.key);
                                                        const navigationKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(e.key);
                                                        if (!validKeys && !navigationKeys) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onPaste={e => {
                                                        const paste = e.clipboardData.getData('Text');
                                                        // Verificar si el contenido pegado tiene caracteres no válidos
                                                        if (!/^[A-Za-z0-9-]*$/.test(paste)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                                    placeholder="A1234-56789"
                                                    disabled={isFormDisabled}
                                                />
                                            )}
                                        />
                                        {errors.licenseNumber && (
                                            <p className="text-sm text-red-500 mt-1">{errors.licenseNumber.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="licenseType" className="block text-sm font-medium mb-2">
                                            License Type
                                        </label>
                                        <select
                                            id="licenseType"
                                            {...register('licenseType', { required: 'License type is required' })}
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                            disabled={isFormDisabled}
                                        >
                                            <option value="" disabled>Select license type</option>
                                            <option value="Class 7">Class 7</option>
                                            <option value="Class 5">Class 5</option>
                                            <option value="Class 4">Class 4</option>
                                        </select>
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
                                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
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

                        {/* Sección de información de learner permit - Solo se muestra si NO tiene licencia */}
                        {hasDriverLicense === 'no' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-center mb-6">Learner Permit Information</h2>
                                <div>
                                    <p className="block text-sm font-medium mb-3">Do you have a learner permit?</p>
                                    <div className="flex space-x-6 mb-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="no"
                                                {...register('hasLearnerPermit', { required: 'Please select an option' })}
                                                className="h-4 w-4 focus:ring-[var(--primary-color)]"
                                                disabled={isFormDisabled}
                                            />
                                            <span>No</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="yes"
                                                {...register('hasLearnerPermit', { required: 'Please select an option' })}
                                                className="h-4 w-4 focus:ring-[var(--primary-color)]"
                                                disabled={isFormDisabled}
                                            />
                                            <span>Yes</span>
                                        </label>
                                    </div>
                                    {errors.hasLearnerPermit && (
                                        <p className="text-sm text-red-500 mt-1">{errors.hasLearnerPermit.message}</p>
                                    )}
                                </div>

                                {/* Si no tiene permiso, mostrar mensaje de error y bloquear el formulario */}
                                {hasLearnerPermit === 'no' && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Sorry!</strong>
                                        <p className="block sm:inline"> You need to have a learner permit to book driving lessons. Please obtain a learner permit and then come back to book your lessons.</p>
                                    </div>
                                )}

                                {/* Si tiene permiso, mostrar opción para cargar imagen */}
                                {hasLearnerPermit === 'yes' && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Upload your learner permit image
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col w-full h-32 border-2 border-dashed hover:bg-gray-100 hover:border-gray-300 rounded-lg">
                                                <div className="flex flex-col items-center justify-center pt-7">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                        Attach a file or take a photo
                                                    </p>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="opacity-0"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setLearnerPermitImage(e.target.files[0]);
                                                            // Resetear la URL previa si había una
                                                            setLearnerPermitImageUrl(null);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {learnerPermitImage && (
                                            <div className="mt-4">
                                                <p className="text-sm text-green-600">File selected: {learnerPermitImage.name}</p>
                                                <div className="mt-2 relative w-full h-40">
                                                    <img
                                                        src={URL.createObjectURL(learnerPermitImage)}
                                                        alt="Uploaded learner permit"
                                                        className="object-contain w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

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
                                            <div key={plan.id} className={`border p-4 rounded-lg hover:bg-gray-50 ${selectedPlan === plan.id ? 'border-[var(--primary-color)] border-2' : ''}`}>
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 items-center">
                                        {instructors.map((instructor, index) => (
                                            <div key={instructor.id}
                                                className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedInstructor === instructor.id
                                                    ? 'border-[var(--primary-color)] border-2'
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
                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: 'Please select a location' }}
                                        render={({ field }) => (
                                            <LocationDropdown
                                                locations={locations}
                                                selectedLocation={field.value}
                                                onChange={(id) => field.onChange(id)}
                                                disabled={isFormDisabled || !selectedClass || !selectedPlan || !selectedInstructor}
                                                error={errors.location?.message}
                                                selectedInstructor={instructors.find(instructor => instructor.id === selectedInstructor)?.name || ''}
                                            />
                                        )}
                                    />
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
                                    {/* Sección de Método de Pago - Mostrar solo si hay fecha/hora seleccionada */}
                                    {selectedDateTime && hasValidTime(selectedDateTime) && !timeSlotError && !validatingTimeSlot && (
                                        <div className="mb-8 mt-6 border p-6 rounded-md bg-white">
                                            <h3 className="text-xl font-semibold">Payment Methods</h3>
                                            
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="radio"
                                                        id="e-transfer"
                                                        value="e-Transfer"
                                                        {...register('paymentMethod')}
                                                        className="h-5 w-5"
                                                    />
                                                    <label htmlFor="e-transfer" className="text-lg">e-Transfer</label>
                                                </div>
                                                
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="radio"
                                                        id="cash"
                                                        value="Pay in Cash"
                                                        {...register('paymentMethod')}
                                                        className="h-5 w-5"
                                                    />
                                                    <label htmlFor="cash" className="text-lg">Pay in Cash</label>
                                                </div>
                                            </div>

                                            {/* Desglose de precio y mensaje para planes con múltiples lecciones */}
                                            {selectedPlan && classes.length > 0 && (() => {
                                                // Buscar el plan seleccionado
                                                const planClass = classes.find(c => c.id === selectedClass);
                                                if (!planClass) return null;
                                                
                                                const plan = planClass.plans.find(p => p.id === selectedPlan);
                                                if (!plan) return null;
                                                
                                                // Calcular precios con GST
                                                const subtotal = plan.price;
                                                const gst = subtotal * 0.05;
                                                const total = subtotal + gst;
                                                const hasMultipleLessons = plan.lessons > 1;
                                                
                                                // Calcular precio de una lección individual con GST incluido
                                                const singleLessonSubtotal = hasMultipleLessons ? (plan.price / plan.lessons) : null;
                                                const singleLessonGst = singleLessonSubtotal ? singleLessonSubtotal * 0.05 : null;
                                                const singleLessonTotal = singleLessonSubtotal && singleLessonGst ? singleLessonSubtotal + singleLessonGst : null;
                                                const singleLessonPrice = singleLessonTotal ? singleLessonTotal.toFixed(2) : null;
                                                
                                                return (
                                                    <div className="mt-6">
                                                        {/* Desglose de precio */}
                                                        <div className="border-t border-b py-4 my-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span>Subtotal</span>
                                                                <span>${subtotal.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span>GST(5%)</span>
                                                                <span>${gst.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center font-bold">
                                                                <span>Total</span>
                                                                <span>${total.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Mensaje adicional para planes con múltiples lecciones */}
                                                        {hasMultipleLessons && (
                                                            <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                                                                <p className="text-blue-800">
                                                                    Please pay for at least one lesson (${singleLessonPrice} with GST included) 24 hours before the lesson starts
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()} 
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                
                {/* Confirm Button - Shows confirmation modal instead of submitting */}
                <div className="mt-8 flex justify-center relative">
                    <Button
                        type="button"
                        onClick={() => {
                            // Calcular precios aquí
                            if (selectedPlan && classes.length > 0) {
                                const planClass = classes.find(c => c.id === selectedClass);
                                if (planClass) {
                                    const plan = planClass.plans.find(p => p.id === selectedPlan);
                                    if (plan) {
                                        const subtotal = plan.price;
                                        const gst = subtotal * 0.05;
                                        const total = subtotal + gst;
                                        const hasMultipleLessons = plan.lessons > 1;
                                        const singleLessonPrice = hasMultipleLessons 
                                            ? (plan.price / plan.lessons).toFixed(2) 
                                            : null;
                                        
                                        setCurrentPrices({
                                            subtotal,
                                            gst,
                                            total,
                                            singleLessonPrice
                                        });
                                        setShowConfirmation(true);
                                    }
                                }
                            }
                        }}
                        className="px-8 py-3 bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-black font-bold rounded-lg cursor-pointer"
                        disabled={isSubmitting || isFormDisabled || validatingTimeSlot || !selectedDateTime || !selectedPlan || !selectedLocation || !hasValidTime(selectedDateTime) || !selectedPaymentMethod}
                    >
                        Review Booking
                    </Button>
                    {/* {selectedDateTime && !hasValidTime(selectedDateTime) && (
                        <p className="text-sm text-red-500 mt-2 absolute -bottom-6 whitespace-nowrap">
                            Por favor selecciona una hora específica, no solo la fecha
                        </p>
                    )} */}
                </div>
                </form>
            
                {/* Confirmation Modal */}
                {showConfirmation && (
                    <ConfirmationModal
                        formData={form.getValues()}
                        selectedPlan={(() => {
                            const planClass = classes.find(c => c.id === selectedClass);
                            if (!planClass) return null;
                            return planClass.plans.find(p => p.id === selectedPlan) || null;
                        })()}
                        selectedClass={classes.find(c => c.id === selectedClass) || null}
                        instructor={instructors.find(i => i.id === selectedInstructor) || null}
                        location={locations.find(l => l.id === selectedLocation) || null}
                        subtotal={currentPrices.subtotal}
                        gst={currentPrices.gst}
                        total={currentPrices.total}
                        singleLessonPrice={currentPrices.singleLessonPrice}
                        onConfirm={() => {
                            setShowConfirmation(false);
                            form.handleSubmit(onSubmit)();
                        }}
                        onCancel={() => setShowConfirmation(false)}
                        isSubmitting={isSubmitting}
                    />
                )}

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

                {!submitSuccess && submitError && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Error processing request</h3>
                        <p>{submitError}</p>
                        <p className="mt-2 text-sm">Please try again or contact support if the problem persists.</p>
                    </div>
                )}
                </>
            )}
            {/* Comentamos DevTool para evitar errores */}
            {/* <DevTool control={control} /> */}
        </div>
    )
}

export default BookingForm
