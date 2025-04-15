import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInstructorLessonsByEmail(email:string){
    const instructor = await prisma.instructor.findUnique({
        where: {email},
        include: {
            lessons:true,
        }
    })

    return instructor?.lessons ?? [];
}

