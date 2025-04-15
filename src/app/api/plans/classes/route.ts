import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener todas las clases de licencia con sus planes asociados
    const planClasses = await prisma.planClass.findMany({
      include: {
        plans: {
          include: {
            plan: true,
          },
        },
      },
    });

    // Transformar los datos para tener el formato esperado por el frontend
    const formattedClasses = planClasses.map(planClass => {
      return {
        id: planClass.id,
        name: planClass.name,
        title: planClass.title,
        description: planClass.description,
        plans: planClass.plans.map(planToClass => {
          const plan = planToClass.plan;
          return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            lessons: plan.lessons,
            price: plan.price,
            time: plan.time
          };
        }),
      };
    });

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error("Error fetching plan classes:", error);
    return NextResponse.json(
      { error: "Error fetching plan classes" },
      { status: 500 }
    );
  }
}
