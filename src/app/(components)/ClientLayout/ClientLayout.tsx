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

  // Renderizamos diferente estructura dependiendo de si es ruta de admin o no
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // Para rutas normales, incluimos Navbar y Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}