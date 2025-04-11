"use client"

import { useState } from "react"
import BookingForm from "@/app/(components)/BookingComponents/Form/Form"
import TrackingForm from "@/app/(components)/BookingComponents/TrackingForm/TrackingForm"

export default function Booking() {
    const [activeTab, setActiveTab] = useState("book")

    return (
        <div className="container mx-auto pt-20 pb-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Driving Lessons</h1>
            
            <div className="w-full max-w-4xl mx-auto">
                {/* Navegación de pestañas simple */}
                <div className="flex justify-center mb-6">
                    <div className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-md">
                        <button
                            onClick={() => setActiveTab("book")}
                            className={`py-2 px-4 rounded-sm text-sm font-medium transition-colors ${activeTab === "book" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Book a Lesson
                        </button>
                        <button
                            onClick={() => setActiveTab("track")}
                            className={`py-2 px-4 rounded-sm text-sm font-medium transition-colors ${activeTab === "track" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Track Your Booking
                        </button>
                    </div>
                </div>
                
                {/* Contenido de las pestañas */}
                {activeTab === "book" && (
                    <div className="mt-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-semibold text-center mb-6">
                                Book Your Driving Lesson
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Fill out the form below to schedule your driving lesson with one of our professional instructors.
                            </p>
                            <BookingForm />
                        </div>
                    </div>
                )}
                
                {activeTab === "track" && (
                    <div className="mt-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-semibold text-center mb-6">
                                Track Your Booking Status
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Enter your tracking number to check the current status of your booking.
                            </p>
                            <TrackingForm />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
