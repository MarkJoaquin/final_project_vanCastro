"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Importa el hook para obtener la ruta actual
import { useEffect, useState } from "react"; // Importa useEffect y useState
import { useAdminDataContext } from "@/app/(context)/adminContext"; // Importa el contexto del instructor logueado
import styles from "./AdminSideBar.module.css"; // Importa el CSS module
import { Menu, X } from "lucide-react"; // Iconos para el menú móvil

export default function AdminSidebar() {
    const pathname = usePathname(); // Obtén la ruta actual
    const [bookingRequestCount, setBookingRequestCount] = useState(0); // Estado para el contador de solicitudes
    const { loginedInstructorData } = useAdminDataContext(); // Obtén los datos del instructor logueado
    const instructorId = loginedInstructorData?.id; // ID del instructor logueado
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar el menú móvil

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await fetch("/api/lessons/request");
                if (!res.ok) throw new Error("Error fetching booking requests");
                const data = await res.json();
                const bookingRequests = data.filter(
                    (request: { lessonStatus: string; instructorId: string }) =>
                        request.lessonStatus === "REQUESTED" &&
                        request.instructorId === instructorId // Filtra por el ID del instructor logueado
                );
                setBookingRequestCount(bookingRequests.length); // Actualiza el contador
            } catch (error) {
                console.error("Error fetching booking requests:", error);
            }
        };

        if (instructorId) {
            fetchBookingRequests(); // Solo ejecuta si hay un instructor logueado
        }
    }, [instructorId]); // Ejecuta el efecto cuando cambie el ID del instructor

    // Función para cerrar el menú móvil al hacer clic en un enlace
    const handleLinkClick = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Botón de menú móvil */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-700" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-700" />
                )}
            </button>

            {/* Overlay para cerrar el menú en móvil */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <aside 
                className={`${styles.sidebar} w-64 md:w-72 lg:w-80 h-screen text-[#777777] fixed z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:relative`}>
            <div className="p-4 text-lg font-bold text-black border-b border-gray-700">
                Admin Panel
            </div>
            <nav className="mt-4">
                <ul className="space-y-2">
                    <li className={styles.link}>
                        <Link
                            href="/admin/calendar"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/calendar" ? styles.active : ""
                            }`}
                            onClick={handleLinkClick}
                        >
                            <Image
                                src="/sidebar/calendar.svg"
                                alt="Calendar"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Calendar
                        </Link>
                    </li>
                    <li className={styles.link}>
                        <Link
                            href="/admin/booking-request"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/booking-request" ? styles.active : ""
                            }`}
                            onClick={handleLinkClick}
                        >
                            <Image
                                src="/sidebar/booking.svg"
                                alt="Booking Request"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Booking Request
                            {bookingRequestCount > 0 && (
                                <span className="ml-2 text-sm text-white bg-red-500 rounded-full px-2 py-1">
                                    {bookingRequestCount}
                                </span>
                            )}
                        </Link>
                    </li>
                    <li className={styles.link}>
                        <Link
                            href="/admin/lesson"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/lesson" ? styles.active : ""
                            }`}
                            onClick={handleLinkClick}
                        >
                            <Image
                                src="/sidebar/lesson.svg"
                                alt="Lesson"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Lesson
                        </Link>
                    </li>
                    <li className={styles.link}>
                        <Link
                            href="/admin/student"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/student" ? styles.active : ""
                            }`}
                            onClick={handleLinkClick}
                        >
                            <Image
                                src="/sidebar/student.svg"
                                alt="Student"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Student
                        </Link>
                    </li>

                    {/* <h2
                        className={`${styles.sideSection} px-4 mt-6 text-sm text-gray-400`}
                    >
                        Finance
                    </h2>
                    <li className={styles.link}>
                        <Link
                            href="/admin/payment"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/payment" ? styles.active : ""
                            }`}
                        >
                            <Image
                                src="/sidebar/payments.svg"
                                alt="Payment"
                                width={20}
                                height={20}
                                className={styles.iconPayment}
                            />
                            Payment
                        </Link>
                    </li>
                    <li className={styles.link}>
                        <Link
                            href="/admin/invoice"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/invoice" ? styles.active : ""
                            }`}
                        >
                            <Image
                                src="/sidebar/invoice.svg"
                                alt="Invoice"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Invoice
                        </Link>
                    </li>
                    <li className={styles.link}>
                        <Link
                            href="/admin/contract"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/contract" ? styles.active : ""
                            }`}
                        >
                            <Image
                                src="/sidebar/contract.svg"
                                alt="Contract"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Contract
                        </Link>
                    </li> */}
                </ul>
            </nav>

            {/* Settings link at the bottom */}
            <div className="absolute bottom-4 w-full">
                <ul>
                    <li className={styles.link}>
                        <Link
                            href="/admin/settings"
                            className={`${styles.activeLink} ${
                                pathname === "/admin/settings" ? styles.active : ""
                            }`}
                            onClick={handleLinkClick}
                        >
                            <Image
                                src="/sidebar/settings.svg"
                                alt="Settings"
                                width={20}
                                height={20}
                                className={styles.icon}
                            />
                            Settings
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
        </>
    
    );
}