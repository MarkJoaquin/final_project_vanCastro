import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { ImWhatsapp } from "react-icons/im";
import ContactForm from "./Contact_Form";
import styles from "./Contact_Us.module.css";
import { SOCIAL_LINKS } from "@/lib/social";

export default function ContactSection() {
  return (
    <section className="w-full bg-[var(--third-color)] py-18 lg:px-15 sm:px-5 flex justify-center">
      <div className={`container grid gap-8 px-4 md:grid-cols-2 md:gap-12 ` + styles.contactUsContainer}>
        <div className="space-y-8">
          <div className={`space-y-4 ` + styles.contactUs}>
            <h2 className={`text-4xl font-bold ` + styles.contactTitle}>Contact Us</h2>
            <p className={styles.workingHours}>Monday to Friday from 8a.m.-6p.m.</p>

            <div className="space-y-4">
              <div className={styles.contactInfo}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                    <Phone className="h-5 w-5 text-[var(--primary-color)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="hover:underline cursor-pointer">Anderson {SOCIAL_LINKS.phoneAnderson}</p>
                    <p className="hover:underline cursor-pointer">Andresa {SOCIAL_LINKS.phoneAndresa}</p>
                  </div>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                    <Mail className="h-5 w-5 text-[var(--primary-color)]" />
                  </div>
                  <Link href={SOCIAL_LINKS.email} target="_blank" rel="noopener noreferrer">
                    <p className="hover:underline">
                      Vancastrodrivingschool@gmail.com
                    </p>
                  </Link>
                </div>
              </div>

              <div className={styles.contactInfo}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                    <MapPin className="h-5 w-5 text-[var(--primary-color)]" />
                  </div>
                  <p>Vancouver, North Vancouver, Burnaby</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`space-y-4 ` + styles.socialMedia}>
            <h3 className="text-xl font-semibold">Visit Our Social media</h3>
            <div className="flex gap-4">
              <Link
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black"
              >
                <Facebook className="h-6 w-6 text-[var(--primary-color)]" />
              </Link>
              <Link
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black"
              >
                <Instagram className="h-6 w-6 text-[var(--primary-color)]" />
              </Link>
              <Link
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black"
              >
                <Youtube className="h-6 w-6 text-[var(--primary-color)]" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black"
              >
                <ImWhatsapp className="h-6 w-6 text-[var(--primary-color)]" />
              </Link>
            </div>
          </div>
        </div>

        <div className={`flex flex-col items-center justify-center gap-4 ` + styles.contactForm}>
          <h4 className="font-semibold">We’re happy to hear from you !</h4>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
