import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

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

    // Convertir el archivo a un ArrayBuffer y luego a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar un nombre único para el archivo
    const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
    
    // Crear la ruta donde se guardará el archivo
    // En una implementación real, probablemente usarías un servicio como S3, Cloudinary, etc.
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, fileName);
    
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Guardar el archivo
    await writeFile(filePath, buffer);
    
    // URL pública del archivo
    const fileUrl = `/uploads/${fileName}`;
    
    // En lugar de buscar y actualizar el estudiante aquí, simplemente retornamos la URL
    // El endpoint principal de registro (/api/lessons/request) se encargará de crear o actualizar
    // el estudiante con todos sus datos, incluyendo esta URL
    
    // Solo como registro, verificamos si ya existe un estudiante con este email
    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });
    
    console.log(
      existingStudent
        ? `Found existing student with email ${email}`
        : `No student found with email ${email}, will be created during form submission`
    );

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
