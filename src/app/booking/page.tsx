import BookingForm from "@/app/(components)/BookingComponents/Form/Form"

export default function Booking() {
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Booking Page</h1>
                <BookingForm />
            </div>
        </>
    )
}



