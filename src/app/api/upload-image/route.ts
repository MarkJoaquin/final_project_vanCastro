import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Esta ruta maneja la subida de imágenes como learner permit
export async function POST(request: NextRequest) {
  try {
    // Asegurarse de que la solicitud es multipart/form-data
    const formData = await request.formData();
    
    // Obtener el archivo de la solicitud
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Obtener el email del estudiante para asociar el archivo
    const email = formData.get('email') as string;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Student email is required' },
        { status: 400 }
      );
    }

    // Convertir el archivo a un ArrayBuffer y luego a Buffer para almacenar en base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convertir a base64 para almacenar en la base de datos
    const base64Image = buffer.toString('base64');
    
    // Generar un ID único para la imagen
    const imageId = uuidv4();
    
    // Construir una URL de datos (data URL) para la imagen
    const fileType = file.type || 'image/jpeg';
    const fileUrl = `data:${fileType};base64,${base64Image}`;
    
    try {
      // Actualizar el estudiante con la URL de datos de la imagen
      const updatedStudent = await prisma.student.upsert({
        where: { email },
        update: { 
          learnerPermitUrl: fileUrl 
        },
        create: {
          email,
          name: email.split('@')[0], // Nombre temporal hasta que se complete el formulario
          phone: '',
          learnerPermitUrl: fileUrl
        }
      });
      
      console.log(`Updated student with email ${email} with learner permit image`);
    } catch (dbError) {
      console.error('Database error while updating student:', dbError);
      // Continuamos aunque haya error en la BD, ya que el endpoint principal
      // también intentará actualizar el estudiante
    }

    return NextResponse.json({
      success: true,
      fileUrl
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    );
  }
}
