import AvailabilitySettings from "@/app/(components)/AdminDashboard/Settings/AvailabilitySettings"

export default function SettingsPage() {

    return (
        <div className="min-h-screen p-4">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>
                
                <AvailabilitySettings />
                
                {/* Aquí se pueden agregar más secciones de configuración en el futuro */}
            </div>
        </div>
    )
}
