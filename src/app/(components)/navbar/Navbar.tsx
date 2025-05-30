'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Image from "next/image";

export default function Navbar() {
    const [activeLink, setActiveLink] = useState<string>("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false); 

    const handleNavbarLinkClick = (linkName: string) => {
        setActiveLink(linkName);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
       setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <div className={styles.navbarSection}>
                    <div className={styles.logo}> 
                        <Link href="/"><Image className={styles.logoImg} src="/images/logo.png" alt="Logo" width={500} height={0} style={{height: "auto"}} priority /></Link>
                    </div>

                    <button
                        className={`${styles.mobileMenuButton} ${isMobileMenuOpen ?             
                             styles.closeButton : styles.openButton}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen ? "true" : "false"}
                        aria-controls="mobileMenu"
                    >
                        {isMobileMenuOpen ? '✖' : '☰'} 
                    </button> 

                    {isMobileMenuOpen && (
                        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)}></div>
                    )}

                    <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ''}`}>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "home" ? 
                                 styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("home")}
                        >
                            <Link href="/">Home</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "plans" ? 
                                 styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("plans")}
                        >
                            <Link href="/plans">Plans</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "faq" ? 
                                 styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("faq")}
                        >
                            <Link href="/faq">FAQ</Link>
                        </li>
                        <li 
                            className={`${styles.singleNavLink} ${activeLink === "contact" ? 
                                 styles.active : ""}`} 
                            onClick={() => handleNavbarLinkClick("contact")}
                        >
                            <Link href="/contact">Contact</Link>
                        </li>
                        <button 
                            className={styles.bookingLink} 
                            onClick={() => handleNavbarLinkClick("bookings")}
                        >
                            <Link href="/booking">Booking</Link>
                        </button>
                    </ul>
                </div>
            </nav>
        </header>  
    );
}
