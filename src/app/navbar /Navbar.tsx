
import Link from "next/link";
// Importa el componente Image de Next.js
import styles from "./Navbar.module.css";

const Navbar = () => {
    return (
        <header>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link href="/">
                        <img src="/images/logo.png" alt="Logo" 
                        width={100} 
                        height={50} />
                    </Link>
                </div>
                <ul className={styles.navLinks}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/plans">Plans</Link>
                    </li>
                    <li>
                        <Link href="/bookings">Bookings</Link>
                    </li>
                    <li>
                        <Link href="/faq">FAQ</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;