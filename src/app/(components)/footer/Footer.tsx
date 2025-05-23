import Image from "next/image";
import "./Footer.css";
import Link from "next/link";
import PhoneImg from "@/../public/footer/footer-phone.svg"
import VanCastroLogo from "@/../public/footer/vancastro-logo.svg"
import FacebookLogo from "@/../public/footer/footer-facebook.svg"
import InstagramLogo from "@/../public/footer/footer-instagram.svg"
import YotubeLogo from "@/../public/footer/footer-youtube.svg"
import WhatsappLogo from "@/../public/footer/footer-whatsapp.svg"
import { SOCIAL_LINKS } from "@/lib/social";

export default function Footer() {

    return (
        <footer className="w-[100%]">
            <div className="footer-container flex justify-between border-b pb-6">
                <div className="footer-contact justify-items-start order-tablet-1">
                    <h3>Contact</h3>
                    <p  className="footer-element"><span>Phone</span></p>
                    <div className=" footer-element contact-driver">
                        <Image
                            src={PhoneImg}
                            alt="phoneImg"
                            height={20}
                            width={20}
                            style={{marginRight:"1rem"}}
                        />
                        <p className="pr-3">Anderson</p>
                        <Link href={`tel:${SOCIAL_LINKS.phoneAnderson}`} target="_blank" rel="noopener noreferrer">
                        <p className="flex hover-element">{SOCIAL_LINKS.phoneAnderson}</p>
                        </Link>
                    </div>
                    <div className="footer-element contact-driver">
                        <Image
                            src={PhoneImg}
                            alt="phoneImg"
                            height={20}
                            width={20}
                            style={{marginRight:"1rem"}}
                        />
                        <p className="pr-3">Andresa</p>
                        <Link href={`tel:${SOCIAL_LINKS.phoneAndresa}`} target="_blank" rel="noopener noreferrer">
                        <p className="flex hover-element">{SOCIAL_LINKS.phoneAndresa}</p>
                        </Link>
                    </div>
                    <Link href={SOCIAL_LINKS.email} target="_blank" rel="noopener noreferrer">
                        <p className="footer-element footer-mail" ><span>Email:</span> Vancastrodrivingschool@gmail.com</p>
                    </Link>
                    <p className="footer-element"><span className="working-hours">Working hours:</span> Monday to Friday 8a.m. - 6p.m.</p>
                </div>  
                <div className="footer-location justify-items-start order-tablet-2">
                    <h3>Location</h3>
                    <p className="footer-element">Burnaby</p>
                    <p className="footer-element">Vancouver</p>
                    <p className="footer-element">North Vancouver</p>
                </div>
                <div className="footer-vancastro justify-items-start order-tablet-3">
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
                <div className="footer-logo mobile-first order-tablet-4">
                    <Link href="/">
                    <Image
                        className="mb-5"
                        src={VanCastroLogo}
                        alt="MainLogo"
                        width={200}
                        height={100}
                    />
                    </Link>
                    <div className="social-media flex justify-between">
                        <div className="div-social-logo flex justify-center">
                            <Link href={SOCIAL_LINKS.facebook}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Image
                                    className="social-logo"
                                    src={FacebookLogo}
                                    alt="Facebook"
                                    width={20}
                                    height={20}
                                />
                            </Link>
                        </div>
                        <div className="div-social-logo flex justify-center">
                            <Link href={SOCIAL_LINKS.instagram}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Image
                                    className="social-logo"
                                    src={InstagramLogo}
                                    alt="instagram"
                                    width={20}
                                    height={20}
                                />
                            </Link>
                        </div>
                        <div className="div-social-logo flex justify-center">
                            <Link href={SOCIAL_LINKS.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center">
                                <Image
                                    className="social-logo"
                                    src={YotubeLogo}
                                    alt="youtube"
                                    width={20}
                                    height={20}
                                />
                            </Link>
                        </div>
                        <div className="div-social-logo flex justify-center">
                            <Image
                                className="social-logo"
                                src={WhatsappLogo}
                                alt="whatsapp"
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-copyright flex justify-end pt-6">
                <p>Copyright Policy</p>
                <p className="ml-3 mr-3 separator">|</p>
                <p>Terms and Conditions</p>
                <p className="ml-3 mr-3 separator">|</p>
                <p>Site Map</p>
            </div>
        </footer>
    )
};