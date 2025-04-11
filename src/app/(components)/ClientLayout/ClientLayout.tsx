"use client";

import { usePathname } from "next/navigation";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || false; // Verifica si es una ruta de administración

  return (
    <>
      {!isAdminRoute && <Navbar />} {/* Renderiza Navbar solo si no es ruta de admin */}
      <main>{children}</main>
      {!isAdminRoute && <Footer />} {/* Renderiza Footer solo si no es ruta de admin */}
    </>
  );
}