import type { Metadata } from "next";
import { Aleo, Lato, Montserrat } from "next/font/google";
import "./globals.css";
import { SessionProviders } from "./providers";
import ClientLayout from "./(components)/ClientLayout/ClientLayout"; // Importa el nuevo componente cliente
import { Toaster } from 'sonner';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

const aleo = Aleo({
  variable: "--font-aleo",
  subsets: ["latin"],
});

const lato = Lato({
  weight: ["400"],
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VanCastro Driving School",
  description: "Book your driving lesson now!",
  icons:{
    icon: "/images/frame.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${montserrat.variable} ${aleo.variable} ${lato.variable} antialiased`}
      >
        <SessionProviders>
          <Toaster position="top-right" richColors closeButton />
          <ClientLayout>{children}</ClientLayout> {/* Usa el componente cliente */}
        </SessionProviders>
      </body>
    </html>
  );
}
