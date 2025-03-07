import "./Footer.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="p-15">
            <div className="footer-container flex justify-between border-b pb-6">
                <div className="footer-contact justify-items-start">
                    <h3>Contact</h3>
                    <p className="footer-element"><span>Phone</span></p>
                    <p className="footer-element flex hover-element"><img className="phone-icon" src="./footer/footer-phone.svg"/>+1 604-600-9173</p>
                    <p className="footer-element flex hover-element"><img className="phone-icon" src="./footer/footer-phone.svg"/>+1 778-680-5613</p>
                    <p className="footer-element"><span>Email:</span>Vancastrodrivingschool@gmail.com</p>
                    <p className="footer-element"><span>Working hours:</span>Monday to Friday 8a.m. - 6p.m.</p>
                </div>
                <div className="footer-location justify-items-start">
                    <h3>Location</h3>
                    <p className="footer-element">Burnaby</p>
                    <p className="footer-element">Vancouver</p>
                    <p className="footer-element">North Vancouver</p>
                </div>
                <div className="footer-vancastro justify-items-start">
                    <h3>Vancastro</h3>
                    <Link href="/">
                        <p className="footer-element hover-element">Home</p>
                    </Link>
                    <Link href="/plans">
                    <p className="footer-element hover-element">Plans</p>
                    </Link>
                    <p className="footer-element hover-element">FAQ</p>
                    <p className="footer-element hover-element">Contact</p>
                </div>
                <div className="footer-logo">
                    <img className="mb-5" src="./footer/vancastro-logo.svg" alt="Logo" />
                    <div className="social-media flex justify-between">
                        <div className="div-social-logo flex justify-center">
                            <img className="social-logo" src="./footer/footer-facebook.svg" alt="Facebook" />
                        </div>
                        <div className="div-social-logo flex justify-center">
                            <img className="social-logo" src="./footer/footer-instagram.svg" alt="Instagram" />    
                        </div>
                        <div className="div-social-logo flex justify-center">
                            <img className="social-logo" src="./footer/footer-youtube.svg" alt="Youtube" />
                        </div>
                        <div className="div-social-logo flex justify-center">
                            <img className="social-logo" src="./footer/footer-whatsapp.svg" alt="Whatsapp" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-copyright flex justify-end pt-6">
                <p>Copyright Policy</p>
                <p className="ml-5 border-l pl-5">Terms and Conditions</p>
                <p className="ml-5 border-l pl-5">Site Map</p>
            </div>
        </footer>
    )
};