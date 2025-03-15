
import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, PhoneIcon as WhatsApp } from "lucide-react"
import ContactForm from "./Contact_Form"

export default function ContactSection() {
  return (
    <section className="w-full bg-[#FFF8E7] py-16">
      <div className="container grid gap-8 px-4 md:grid-cols-2 md:gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Contact Us</h2>
            <p className="text-gray-600">Monday to Friday from 8a.m.-6p.m.</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div className="space-y-1">
                  <p>+1 604-600-9173</p>
                  <p>+1 778-680-5613</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <p>Vancastrodrivingschool@gmail.com</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <p>Vancouver, North Vancouver, Burnaby</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Visit Our Social media</h3>
            <div className="flex gap-4">
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <Youtube className="h-5 w-5 text-white" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <WhatsApp className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

