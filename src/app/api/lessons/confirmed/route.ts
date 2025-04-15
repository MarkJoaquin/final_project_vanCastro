import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST (req: Request){
    const {email} = await req.json();

    if(!email){
        return NextResponse.json({message:"Email is required"},{status:400});
    }

    const instructor = await prisma.instructor.findUnique({
        where: {email},
        include: {
            lessons: {
                include: {
                    student:true
                }
            }
        }
    })

    return NextResponse.json(instructor?.lessons ?? []);
}


