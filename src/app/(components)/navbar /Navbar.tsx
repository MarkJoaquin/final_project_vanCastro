'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [activeLink, setActiveLink] = useState<string>("");
    /* const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);  */

    const handleNavbarLinkClick = (linkName: string) => {
        setActiveLink(linkName);
        /* setIsMobileMenuOpen(false);  */
    };

    const toggleMobileMenu = () => {
       /*  setIsMobileMenuOpen(!isMobileMenuOpen);  */
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <div className={styles.navbarSection }>
                    <div className={styles.logo}> 
                        <img className={styles.logoImg} src="/images/logo.png" alt="Logo" width={100} height={50} />
                    </div>

                    {/* <button
                        className={styles.mobileMenuButton}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen ? "true" : "false"}
                    >
                        {isMobileMenuOpen ? '✖' : '☰'} 
                    </button> */}
                    {/*  {isMobileMenuOpen && ( */}
                    <ul className={styles.navLinks}>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "home" ? styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("home")}
                        >
                            <Link href="/">Home</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "plans" ? styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("plans")}
                        >
                            <Link href="/plans">Plans</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "bookings" ? styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("bookings")}
                        >
                            <Link href="/booking">Booking</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "faq" ? styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("faq")}
                        >
                            <Link href="/faq">FAQ</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "contact" ? styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("contact")}
                        >
                            <Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                    {/* )} */}

                </div>
            </nav>
        </header>  
    );
}
