"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Importa el hook para obtener la ruta actual
import styles from "./AdminSideBar.module.css"; // Importa el CSS module

export default function AdminSidebar() {
  const pathname = usePathname(); // Obtén la ruta actual

  return (
    <aside className={`${styles.sidebar} w-70 h-screen text-[#777777] fixed`}>
      <div className="p-4 text-lg font-bold text-white border-b border-gray-700">
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
            >
              <Image src="/sidebar/calendar.svg" alt="Calendar" width={20} height={20} className={styles.icon} />
              Calendar
            </Link>
          </li>
          <li className={styles.link}>
            <Link
              href="/admin/booking-request"
              className={`${styles.activeLink} ${
                pathname === "/admin/booking-request" ? styles.active : ""
              }`}
            >
              <Image src="/sidebar/booking.svg" alt="Booking Request" width={20} height={20} className={styles.icon} />
              Booking Request
            </Link>
          </li>
          <li className={styles.link}>
            <Link
              href="/admin/pending-action"
              className={`${styles.activeLink} ${
                pathname === "/admin/pending-action" ? styles.active : ""
              }`}
            >
              <Image src="/sidebar/pending.svg" alt="Pending Action" width={20} height={20} className={styles.icon} />
              Pending Action
            </Link>
          </li>
          <li className={styles.link}>
            <Link
              href="/admin/lesson"
              className={`${styles.activeLink} ${
                pathname === "/admin/lesson" ? styles.active : ""
              }`}
            >
              <Image src="/sidebar/lesson.svg" alt="Lesson" width={20} height={20} className={styles.icon} />
              Lesson
            </Link>
          </li>
          <li className={styles.link}>
            <Link
              href="/admin/student"
              className={`${styles.activeLink} ${
                pathname === "/admin/student" ? styles.active : ""
              }`}
            >
              <Image src="/sidebar/student.svg" alt="Student" width={20} height={20} className={styles.icon} />
              Student
            </Link>
          </li>

          <h2 className={`${styles.sideSection} px-4 mt-6 text-sm text-gray-400`}>Finance</h2>
          <li className={styles.link}>
            <Link
              href="/admin/payment"
              className={`${styles.activeLink} ${
                pathname === "/admin/payment" ? styles.active : ""
              }`}
            >
              <Image src="/sidebar/payments.svg" alt="Payment" width={20} height={20} className={styles.iconPayment} />
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
              <Image src="/sidebar/invoice.svg" alt="Invoice" width={20} height={20} className={styles.icon} />
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
              <Image src="/sidebar/contract.svg" alt="Contract" width={20} height={20} className={styles.icon} />
              Contract
            </Link>
          </li>
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
            >
              <Image src="/sidebar/settings.svg" alt="Settings" width={20} height={20} className={styles.icon} />
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}