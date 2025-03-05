import "./Footer.css";

export default function Footer() {
    return (
        <footer className="text-center flex justify-between p-4">
            <div className="footer-contact">
                <h3>Contact</h3>
                <p>Phone</p>
                <p>+1 604-600-9173</p>
                <p>+1 778-680-5613</p>
                <p>Email: Vancastrodrivingschool@gmail.com</p>
                <p>Working hours: Monday to Friday 8a.m. - 6p.m.</p>
            </div>
            <div className="footer-location">
                <h3>Location</h3>
                <p>Burnaby</p>
                <p>Vancouver</p>
                <p>North Vancouver</p>
            </div>
            <div className="footer-vancastro">
                <h3>Vancastro</h3>
                <p>Home</p>
                <p>Plans</p>
                <p>FAQ</p>
                <p>Contact</p>
            </div>
            <div className="footer-logo">
                <img src="./vancastro-logo.svg" alt="Logo" />
                <div className="social-media flex">
                    <img src="./footer-facebook.svg" alt="Facebook" />
                    <img src="./footer-instagram.svg" alt="Instagram" />
                    <img src="./footer-youtube.svg" alt="Youtube" />
                    <img src="./footer-whatsapp.svg" alt="Whatsapp" />
                </div>
            </div>
        </footer>
    )
};