import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ajustá según cómo exportás tu cliente de Prisma

export async function GET() {
  try {
    console.log("Iniciando búsqueda de lecciones en tabla plan"); 
    
    // Obtener los detalles de la solicitud
    console.log("Consultando tabla lessons...");

    const plans = await prisma.plan.findMany({
      select: {
        name: true,
        lessons: true
      }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching lesson counts:", error);
    return NextResponse.json({ error: "Failed to fetch lesson counts" }, { status: 500 });
  }
}