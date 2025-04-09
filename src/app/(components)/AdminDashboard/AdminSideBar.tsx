"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AdminSideBar.module.css"; // Import the CSS module

export default function AdminSidebar() {
    return (
        <aside className={`${styles.sidebar} w-64 h-screen text-[#777777] fixed`}>
        <div className="p-4 text-lg font-bold border-b border-gray-700">
            Admin Panel
        </div>
        <nav className="mt-4">
            <ul className="space-y-2">
                <li className={styles.link}>
                    <Link href="/admin/calendar" className={styles.activeLink}>
                    <Image src="/sidebar/calendar.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Calendar
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/booking-request" className={styles.activeLink}>
                    <Image src="/sidebar/booking.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Booking Request
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/pending-action" className={styles.activeLink}>
                    <Image src="/sidebar/pending.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Pending Action
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/lesson" className={styles.activeLink}>
                    <Image src="/sidebar/lesson.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Lesson
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/student" className={styles.activeLink}>
                    <Image src="/sidebar/student.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Student
                    </Link>
                </li>

            <h2 className={styles.sideSection}>Finance</h2>
                <li className={styles.link}>
                    <Link href="/admin/payment" className={styles.activeLink}>
                    <Image src="/sidebar/payments.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Payment
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/invoice" className={styles.activeLink}>
                    <Image src="/sidebar/invoice.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Invoice
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/contract" className={styles.activeLink}>
                    <Image src="/sidebar/contract.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Contract
                    </Link>
                </li>
                <li className={styles.link}>
                    <Link href="/admin/settings" className={styles.activeLink}>
                    <Image src="/sidebar/settings.svg" alt="Calendar" width={20} height={20} className="inline-block mr-2" />
                    Settings
                    </Link>
                </li>
            </ul>
        </nav>
        </aside>
    );
}