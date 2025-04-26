import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    console.log("Iniciando búsqueda de lecciones confirmadas en tabla lesson");
    
    // Utilizamos la tabla lesson directamente como se requiere
    console.log("Consultando tabla lessons...");
    
    // Hacemos la consulta a la tabla lesson, filtrando por estado CONFIRMED
    let confirmedLessons: string | any[] = [];
    try {
      confirmedLessons = await prisma.lesson.findMany({ 
        where: {
          status: "CONFIRMED", // Solo lecciones confirmadas
        },
        select: {
          // Campos directos de la tabla Lesson
          id: true,
          studentId: true,
          instructorId: true,
          date: true,
          startTime: true,
          endTime: true,
          duration: true,
          locationId: true,
          plan: true,
          price: true,
          status: true,
          paymentStatus: true,
          licenseClass: true,
          paymentMethod: true,
          trackingNumber: true,
          createdAt: true,
          updatedAt: true,
          // Relaciones
          student: {
            select: {
              name: true,
              phone: true,  // Incluir el número de teléfono
              hasLicense: true,
              learnerPermitUrl: true,
              licenses: {
                select: {
                  licenseNumber: true,
                  licenseType: true,
                  expirationDate: true,
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              },
            },
          },
          location: {
            select: {
              name: true,
              city: true,
            },
          },
        },
      });
      
      console.log(`Encontradas ${confirmedLessons.length} lecciones confirmadas en tabla lesson`);
      
    } catch (prismaError) {
      // Manejo específico de errores de Prisma
      if (prismaError instanceof Prisma.PrismaClientKnownRequestError) {
        const errorCode = prismaError.code;
        console.error(`Error de Prisma ${errorCode}:`, prismaError.message);
        
        if (errorCode === 'P2032') {
          console.log("La tabla lessons existe en el esquema pero aún no tiene datos o no existe en la BD");
        } else if (prismaError.message.includes("locationId") && prismaError.message.includes("non-nullable")) {
          console.log("Hay un problema con campos nulos en la tabla lessons");
        }
      } else {
        console.error("Error no identificado al consultar lecciones:", prismaError);
      }
      
      // Ante cualquier error, devolvemos array vacío para que la UI funcione
      confirmedLessons = [];
    }
    
    // Siempre devolvemos el resultado, sea un array con datos o vacío si hubo error
    return NextResponse.json(confirmedLessons);
    
  } catch (error) {
    // Error general (no debería ocurrir, pero por seguridad)
    console.error("Error completo al obtener lecciones confirmadas:", error);
    return NextResponse.json([]);
  } finally {
    // Siempre desconectamos Prisma al final
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error("Error al desconectar Prisma:", e);
    }
  }
}

export async function POST(req: Request) {
    const { email } = await req.json();

    // Si no se proporciona un email, devolver todas las lecciones confirmadas
    if (!email) {
        const allLessons = await prisma.lesson.findMany({
            where: {
                status: "CONFIRMED", // Solo lecciones confirmadas
            },
            include: {
                student: true,
                instructor: true,
                location: true,
            },
        });
        return NextResponse.json(allLessons);
    }

    // Si se proporciona un email, filtrar por el instructor correspondiente
    const instructor = await prisma.instructor.findUnique({
        where: { email },
        include: {
            lessons: {
                where: { status: "CONFIRMED" },
                include: {
                    student: {
                      include: {
                        licenses: {
                          orderBy: {
                            createdAt: 'desc'
                          },
                          take: 1
                        }
                      }
                    }
                }
            }
        }
    })

    return NextResponse.json(instructor?.lessons ?? []);
}


