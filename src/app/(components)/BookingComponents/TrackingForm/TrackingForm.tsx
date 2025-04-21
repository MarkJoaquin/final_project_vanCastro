"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FaMapMarkerAlt } from 'react-icons/fa'

type FormData = {
  trackingNumber: string
}

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' |
  'REQUESTED' | 'AWAITING_PAYMENT' | 'REJECTED' | 'LATE_RESPONSE'

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'

type BookingData = {
  id: string
  studentName: string
  instructorName: string
  date: string
  startTime: string
  endTime: string
  duration: string
  location: string
  plan: string
  price: string
  licenseClass: string
  status: BookingStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: string
  trackingNumber: string
  createdAt: string
}

type TrackingResponse = {
  found: boolean
  type?: 'lesson' | 'request'
  data?: BookingData
  error?: string
}

const TrackingForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [isLoading, setIsLoading] = useState(false)
  const [trackingResult, setTrackingResult] = useState<TrackingResponse | null>(null)

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setTrackingResult(null)

    try {
      const response = await fetch(`/api/lessons/tracking?trackingNumber=${data.trackingNumber}`)
      const result = await response.json()

      setTrackingResult(result)
    } catch (error) {
      console.error('Error tracking booking:', error)
      setTrackingResult({
        found: false,
        error: 'Failed to fetch booking information. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'AWAITING_PAYMENT':
      case 'PENDING':
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'LATE_RESPONSE':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Track Your Booking</h3>
          <p className="text-gray-600 text-sm">
            Enter your tracking number to check the status of your booking
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="trackingNumber" className="block text-sm font-medium">Tracking Number</label>
            <Input
              id="trackingNumber"
              placeholder="Enter your tracking number"
              {...register('trackingNumber', {
                required: 'Tracking number is required'
              })}
            />
            {errors.trackingNumber && (
              <p className="text-sm text-red-500">{errors.trackingNumber.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              'Track Booking'
            )}
          </Button>
        </form>
      </div>

      {trackingResult && (
        <div className="mt-6">
          {trackingResult.found ? (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Booking Information</h3>
                <p className="text-gray-600 text-sm">
                  Tracking Number: {trackingResult.data?.trackingNumber}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(trackingResult.data?.status as BookingStatus)}`}>
                    {trackingResult.data?.status.replace('_', ' ')}
                  </span>
                </div>

                {trackingResult.data?.paymentStatus && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(trackingResult.data.paymentStatus)}`}>
                      {trackingResult.data.paymentStatus}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Lesson Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span>{formatDate(trackingResult.data?.date || '')}</span>

                    <span className="text-gray-600">Time:</span>
                    <span>{trackingResult.data?.startTime} - {trackingResult.data?.endTime}</span>

                    <span className="text-gray-600">Duration:</span>
                    <span>{trackingResult.data?.duration} min</span>

                    <span className="text-gray-600">Instructor:</span>
                    <span>{trackingResult.data?.instructorName}</span>

                    <span className="text-gray-600">Location:</span>
                    <span className="flex items-center gap-2">
                      {trackingResult.data?.location}
                      {trackingResult.data?.location && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trackingResult.data.location)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="View on Google Maps"
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaMapMarkerAlt size={16} />
                        </a>
                      )}
                    </span>

                    <span className="text-gray-600">License Class:</span>
                    <span>{trackingResult.data?.licenseClass}</span>

                    <span className="text-gray-600">Plan:</span>
                    <span>{trackingResult.data?.plan}</span>

                    <span className="text-gray-600">Price:</span>
                    <span>${trackingResult.data?.price}</span>

                    {trackingResult.data?.paymentMethod && (
                      <>
                        <span className="text-gray-600">Payment Method:</span>
                        <span>{trackingResult.data.paymentMethod}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 pt-4 border-t">
                  Booked on {formatDate(trackingResult.data?.createdAt || '')}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-6 border border-red-200">
              <h3 className="text-xl font-semibold text-red-600">Booking Not Found</h3>
              <p className="text-gray-600 mt-2">
                {trackingResult.error || 'No booking found with this tracking number. Please check and try again.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TrackingForm
