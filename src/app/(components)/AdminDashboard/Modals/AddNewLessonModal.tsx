"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Clock, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./styles/calendar-styles.css";

interface AddNewLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorId: string;
  onSuccess: () => void;
}

interface ValidationState {
  status: 'idle' | 'validating' | 'valid' | 'invalid';
  message: string | null;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string; // Hacemos phone opcional
}

interface PlanClass {
  id: string;
  name: string;
  title: string;
  plans: Plan[];
}

interface Plan {
  id: string;
  name: string;
  description: string;
  lessons: number;
  price: number;
  time: number;
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
}

interface FormData {
  studentId: string;
  licenseClass: string;
  plan: string;
  location: string;
  dateTime: Date | null;
}

const AddNewLessonModal = ({
  isOpen,
  onClose,
  instructorId,
  onSuccess
}: AddNewLessonModalProps): React.ReactNode => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<PlanClass[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatingTimeSlot, setValidatingTimeSlot] = useState(false);
  const [timeSlotValidation, setTimeSlotValidation] = useState<ValidationState>({
    status: 'idle',
    message: null
  });
  const [unavailableSlots, setUnavailableSlots] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<{startTime: string, endTime: string}[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { register, control, watch, reset, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      studentId: '',
      licenseClass: '',
      plan: '',
      location: '',
      dateTime: null
    }
  });

  // Watch form fields
  const selectedStudent = watch('studentId');
  const selectedClass = watch('licenseClass');
  const selectedPlan = watch('plan');
  const selectedLocation = watch('location');
  const selectedDateTime = watch('dateTime');

  // Fetch students, classes, and locations data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch students for this instructor
        const studentsRes = await fetch(`/api/students?instructorId=${instructorId}`);
        const studentsData = await studentsRes.json();
        setStudents(studentsData);

        // Fetch class/plan data
        const classesRes = await fetch('/api/plans/classes');
        const classesData = await classesRes.json();
        setClasses(classesData);

        // Fetch locations
        const locationsRes = await fetch('/api/locations');
        const locationsData = await locationsRes.json();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, instructorId]);

  // Función para validar la disponibilidad del slot de tiempo seleccionado
  const validateTimeSlot = async () => {
    if (selectedDateTime && selectedLocation && selectedPlan && selectedClass) {
      setValidatingTimeSlot(true);
      setTimeSlotValidation({
        status: 'validating',
        message: 'Checking availability...' 
      });

      try {
        // Ensure we're working with the local time as selected in the DatePicker
        // Esto garantiza que usamos la hora que ve el usuario, no UTC
        const date = selectedDateTime;
        const planDetails = classes
          .find(c => c.id === selectedClass)?.plans
          .find(p => p.id === selectedPlan);

        if (!planDetails) {
          setValidatingTimeSlot(false);
          setTimeSlotValidation({
            status: 'invalid',
            message: 'No details found for the selected plan'
          });
          return;
        }

        const duration = planDetails.time;

        // Extraer componentes de fecha y hora en la zona horaria local (Vancouver - Pacific Time)
        // Esto garantiza que usamos la hora que ve el usuario, no UTC
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;

        // Formato de fecha para la API (YYYY-MM-DD) en hora local de Vancouver
        // Usamos toLocaleDateString para obtener la fecha en formato local
        // y luego la convertimos al formato esperado por la API
        const localDate = date.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD en Canadá
        const dateStr = localDate; // Ya está en formato YYYY-MM-DD

        const response = await fetch('/api/lessons/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instructorId,
            lessonDate: dateStr,
            lessonTime: time,
            planId: selectedPlan,
            locationId: selectedLocation,
          }),
        });

        if (!response.ok) {
          throw new Error('Error validating time slot');
        }

        const data = await response.json();

        if (data.isAvailable) {
          setTimeSlotValidation({
            status: 'valid',
            message: 'Slot available!'
          });
        } else {
          setTimeSlotValidation({
            status: 'invalid',
            message: data.message || 'This time slot is not available'
          });
          // Opcional: resetear el valor del campo dateTime
          // setValue('dateTime', null);
        }
      } catch (error) {
        console.error('Error validating time slot:', error);
        setTimeSlotValidation({
          status: 'invalid',
          message: 'Error validating time slot'
        });
      } finally {
        setValidatingTimeSlot(false);
      }
    }
  };

  // Ejecutar la validación cuando cambian los datos relevantes
  useEffect(() => {
    validateTimeSlot();
  }, [selectedDateTime, selectedLocation, selectedPlan, selectedClass, classes, instructorId]);

  // Fetch instructor availability when instructor changes
  useEffect(() => {
    if (instructorId) {
      const fetchAvailability = async () => {
        try {
          const response = await fetch(`/api/availability/${instructorId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch availability');
          }
          const data = await response.json();
          setAvailableTimes(data);
        } catch (err) {
          console.error('Error loading instructor availability:', err);
          // Si hay un error, establecer horarios predeterminados (9 AM - 5 PM)
          setAvailableTimes([{ startTime: '09:00', endTime: '17:00' }]);
        }
      };

      fetchAvailability();
    }
  }, [instructorId]);

  // Fetch unavailable time slots when date or location changes
  useEffect(() => {
    if (selectedDateTime && selectedLocation) {
      const fetchUnavailableSlots = async () => {
        try {
          // Use the selected date for unavailable slots
          const date = new Date(selectedDateTime);
          date.setHours(0, 0, 0, 0); // Reset time to start of day
          
          // Format date as YYYY-MM-DD for API
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;

          try {
            // 1. Obtener slots no disponibles por validación de tránsito y otras restricciones
            const unavailableResponse = await fetch(`/api/lessons/unavailable?date=${dateStr}&instructorId=${instructorId}&locationId=${selectedLocation}`);
            
            // 2. Obtener lecciones existentes del instructor para la fecha seleccionada
            const existingLessonsResponse = await fetch(`/api/lessons/instructor/${instructorId}?date=${dateStr}`);
            
            let unavailableTimes: Date[] = [];
            
            // Procesar slots no disponibles por validación
            if (unavailableResponse.ok) {
              const data = await unavailableResponse.json();
              
              if (data.unavailableTimes && Array.isArray(data.unavailableTimes)) {
                const validationUnavailableTimes = data.unavailableTimes.map((timeStr: string) => {
                  const [hours, minutes] = timeStr.split(':').map(Number);
                  const time = new Date(date);
                  time.setHours(hours, minutes, 0, 0);
                  return time;
                });
                
                unavailableTimes = [...validationUnavailableTimes];
              }
            } else {
              console.log('No data for unavailable slots from validation');
            }
            
            // Procesar lecciones existentes del instructor
            if (existingLessonsResponse.ok) {
              const lessonsData = await existingLessonsResponse.json();
              
              if (lessonsData.lessons && Array.isArray(lessonsData.lessons)) {
                const lessonUnavailableTimes = lessonsData.lessons.flatMap((lesson: any) => {
                  // Extraer hora de inicio y duración
                  const startTime = lesson.lessonTime;
                  const duration = parseInt(lesson.lessonDuration) || 60; // Duración en minutos, por defecto 60
                  
                  // Crear un array de slots de 15 minutos para toda la duración de la lección
                  const slots: Date[] = [];
                  
                  if (startTime) {
                    const [hours, minutes] = startTime.split(':').map(Number);
                    const startDate = new Date(date);
                    startDate.setHours(hours, minutes, 0, 0);
                    
                    // Agregar el slot inicial
                    slots.push(new Date(startDate));
                    
                    // Agregar slots para toda la duración (cada 15 minutos)
                    const numSlots = Math.ceil(duration / 15);
                    for (let i = 1; i < numSlots; i++) {
                      const slotTime = new Date(startDate);
                      slotTime.setMinutes(startDate.getMinutes() + (i * 15));
                      slots.push(slotTime);
                    }
                  }
                  
                  return slots;
                });
                
                // Combinar con los slots no disponibles por validación
                unavailableTimes = [...unavailableTimes, ...lessonUnavailableTimes];
              }
            } else {
              console.log('No data for existing lessons');
            }
            
            // Eliminar duplicados (si hay)
            const uniqueUnavailableTimes = unavailableTimes.filter((time, index, self) => 
              index === self.findIndex(t => 
                t.getHours() === time.getHours() && t.getMinutes() === time.getMinutes()
              )
            );
            
            setUnavailableSlots(uniqueUnavailableTimes);
            console.log('Total unavailable times loaded:', uniqueUnavailableTimes.length, uniqueUnavailableTimes);
            
          } catch (apiError) {
            console.error('Error with API calls:', apiError);
            setUnavailableSlots([]);
          }
        } catch (error) {
          console.error('Error in fetchUnavailableSlots:', error);
          setUnavailableSlots([]);
        }
      };

      fetchUnavailableSlots();
    }
  }, [selectedDateTime, selectedLocation, instructorId]);

  // Generate all possible time slots based on instructor's availability
  // Using Vancouver time (Pacific Time)
  const getTimeIntervals = () => {
    const intervals: Date[] = [];
    
    // Si no hay horarios disponibles, devolver un array vacío
    if (!availableTimes.length) return intervals;
    
    const currentDate = new Date();

    // IMPORTANTE: Crear una nueva fecha usando componentes locales
    // Esto garantiza que trabajamos en la zona horaria local (Vancouver)
    // y no en UTC
    const baseDate = selectedDateTime
      ? new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate())
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Usar los horarios de disponibilidad del instructor en lugar de horas fijas
    for (const slot of availableTimes) {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      let currentTime = new Date(baseDate);
      currentTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(baseDate);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      // Generar intervalos de 15 minutos dentro del horario disponible
      while (currentTime <= endTime) {
        // Solo agregamos intervalos de 15 minutos (0, 15, 30, 45)
        if (currentTime.getMinutes() % 15 === 0) {
          intervals.push(new Date(currentTime));
        }
        
        // Avanzar 1 minuto para capturar todos los intervalos posibles
        currentTime = new Date(currentTime.getTime() + 60000);
      }
    }

    return intervals;
  };

  // Filter function for the DatePicker
  const filterTime = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Solo permitir intervalos de 15 minutos (0, 15, 30, 45)
    if (minutes % 15 !== 0) return false;
    
    // Verificar si está dentro del horario de trabajo del instructor
    const timeInMinutes = hours * 60 + minutes;
    const isWithinWorkingHours = availableTimes.some(slot => {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      
      return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
    });
    
    if (!isWithinWorkingHours) {
      // console.log(`Time ${timeString} is outside working hours`);
      return false;
    }
    
    // MÉTODO ROBUSTO: Comparar strings de hora en lugar de objetos Date
    // Esto evita problemas con diferentes instancias de objetos Date
    const isUnavailable = unavailableSlots.some(unavailable => {
      const unavailableHour = unavailable.getHours();
      const unavailableMinute = unavailable.getMinutes();
      const unavailableString = `${unavailableHour.toString().padStart(2, '0')}:${unavailableMinute.toString().padStart(2, '0')}`;
      
      const match = unavailableHour === hours && unavailableMinute === minutes;
      if (match) {
        console.log(`Found unavailable match for ${timeString} (${unavailableString})`);
      }
      return match;
    });
    
    // Solo devolver true si está dentro del horario de trabajo Y no está en la lista de slots no disponibles
    return !isUnavailable;
  };

  // Check if a date is a weekend
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  // Check if a date is a holiday (placeholder - you might want to implement actual holiday checking)
  const isHoliday = (date: Date) => {
    // Implement holiday checking logic here if needed
    // For now, we'll just return false
    return false;
  };

  // Get a date 2 weeks from now
  const getStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 weeks from now
    
    // If it lands on a weekend, move to next Monday
    while (isWeekend(date) || isHoliday(date)) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  };

  // Check if a datetime has valid time (not 00:00:00)
  const hasValidTime = (date: Date | null) => {
    if (!date) return false;
    return date.getHours() !== 0 || date.getMinutes() !== 0;
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Get plan details
      const planDetails = classes
        .find(c => c.id === data.licenseClass)?.plans
        .find(p => p.id === data.plan);

      if (!planDetails) {
        throw new Error('Plan details not found');
      }

      // Obtener la fecha y hora seleccionada por el usuario
      const date = data.dateTime;
      if (!date) {
        throw new Error('Date and time are required');
      }
      
      // IMPORTANTE: Extraer componentes de fecha y hora en la zona horaria local (Vancouver - Pacific Time)
      // Esto garantiza que usamos la hora que ve el usuario, no UTC
      // JavaScript Date.getHours() ya devuelve la hora en la zona horaria local del navegador
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;

      // Calculate end time based on duration
      const startHours = date.getHours();
      const startMinutes = date.getMinutes();
      const totalMinutes = startHours * 60 + startMinutes + planDetails.time;
      const endHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
      const endMinutes = (totalMinutes % 60).toString().padStart(2, '0');
      const endTime = `${endHours}:${endMinutes}`;

      // Prepare lesson request data for admin endpoint
      const lessonData = {
        studentId: data.studentId,
        instructorId,
        lessonDate: dateStr,
        lessonTime: time,
        endTime,
        lessonDuration: planDetails.time.toString(),
        lessonLocation: data.location,
        lessonPlan: data.plan,
        lessonPrice: planDetails.price.toString(),
        licenseClass: data.licenseClass,
        paymentMethod: 'Cash' // Default payment method for instructor-created lessons
      };

      // Submit to the new admin endpoint
      const response = await fetch('/api/lessons/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error creating lesson request');
      }

      // Reset form and close modal on success
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-800">Add New Lesson</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              {/* Student Selection */}
              <div className="mb-4">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  id="studentId"
                  {...register('studentId', { required: 'Student is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 py-2 px-3 border"
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>
                )}
              </div>

              {/* License Class Selection */}
              <div className="mb-4">
                <label htmlFor="licenseClass" className="block text-sm font-medium text-gray-700 mb-1">
                  License Class
                </label>
                <select
                  id="licenseClass"
                  {...register('licenseClass', { required: 'License class is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 py-2 px-3 border"
                >
                  <option value="">Select a license class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.title}
                    </option>
                  ))}
                </select>
                {errors.licenseClass && (
                  <p className="text-red-500 text-sm mt-1">{errors.licenseClass.message}</p>
                )}
              </div>

              {/* Plan Selection */}
              <div className="mb-4">
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Plan
                </label>
                <select
                  id="plan"
                  {...register('plan', { required: 'Lesson plan is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 py-2 px-3 border"
                  disabled={!selectedClass}
                >
                  <option value="">Select a plan</option>
                  {selectedClass &&
                    classes
                      .find(c => c.id === selectedClass)?.plans
                      .map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.lessons} lessons ({plan.time} mins) - ${plan.price}
                        </option>
                      ))}
                </select>
                {errors.plan && (
                  <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
                )}
              </div>

              {/* Location Selection */}
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  {...register('location', { required: 'Location is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 py-2 px-3 border"
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Date and Time Selection */}
              <div className="mb-4">
                <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Date and Time
                </label>
                
                {/* Contenedor flexible para calendario y horas */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Columna del calendario */}
                  <div className="md:w-1/2">
                    <h4 className="text-sm font-medium mb-2">Pick a Date</h4>
                    <div className="calendar-container">
                      <DatePicker
                        selected={selectedDateTime || selectedDate}
                        onChange={(date) => {
                          if (date) {
                            // Establecer solo la fecha, manteniendo la hora en 00:00
                            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                            setSelectedDate(dateOnly);
                          }
                        }}
                        onMonthChange={(date) => {
                          // When month changes, update selected date
                          const dateOnly = new Date(date);
                          dateOnly.setHours(0, 0, 0, 0);
                          setSelectedDate(dateOnly);
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
                  <div className="md:w-1/2">
                    <Controller
                      control={control}
                      name="dateTime"
                      rules={{ required: 'Date and time are required' }}
                      render={({ field }) => (
                        <>
                          {selectedDate ? (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Available Times</h4>
                              <div className="h-80 overflow-y-auto pr-2 border rounded-md p-4 bg-white shadow-sm">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {getTimeIntervals().map((time, index) => {
                                    const isAvailable = filterTime(time);
                                    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
                                    const isSelected = field.value && 
                                      field.value.getHours() === time.getHours() && 
                                      field.value.getMinutes() === time.getMinutes();
                                    
                                    return (
                                      <button
                                        key={index}
                                        type="button"
                                        disabled={!isAvailable}
                                        className={`py-3 px-4 rounded-md text-base font-medium w-full ${isSelected 
                                          ? 'bg-blue-500 text-white shadow-md' 
                                          : isAvailable 
                                            ? 'bg-white border hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors' 
                                            : 'bg-gray-100 text-gray-400 line-through !cursor-not-allowed pointer-events-none'}`}
                                        onClick={() => {
                                          if (isAvailable && selectedDate) {
                                            const newDateTime = new Date(selectedDate);
                                            newDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0); 
                                            field.onChange(newDateTime);
                                            // Actualizar selectedDateTime para la validación
                                            setValue('dateTime', newDateTime);
                                            // La validación se ejecutará automáticamente por el useEffect
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
                        </>
                      )}
                    />
                  </div>
                </div>
                
                {/* Mensajes de estado y validación */}
                <div className="mt-2">
                  {errors.dateTime && (
                    <p className="text-sm text-red-500 text-center">
                      {errors.dateTime.message}
                    </p>
                  )}
                  
                  {/* Validation message */}
                  {timeSlotValidation.status !== 'idle' && timeSlotValidation.message && (
                    <div className={`validation-message ${timeSlotValidation.status} mt-2 text-center`}>
                      {timeSlotValidation.status === 'validating' && (
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{timeSlotValidation.message}</span>
                        </div>
                      )}
                      {timeSlotValidation.status === 'valid' && (
                        <div className="flex items-center justify-center">
                          <Check className="h-4 w-4 mr-1" />
                          <span>{timeSlotValidation.message}</span>
                        </div>
                      )}
                      {timeSlotValidation.status === 'invalid' && (
                        <div className="flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{timeSlotValidation.message}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedDateTime && (
                    <p className="text-sm text-green-500 text-center mt-2">
                      You selected: {selectedDateTime.toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium border-0"
              disabled={isSubmitting || validatingTimeSlot || timeSlotValidation.status !== 'valid' || !selectedDateTime || !hasValidTime(selectedDateTime)}
            >
              {isSubmitting ? 'Creating...' : 'Add Lesson'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLessonModal;
