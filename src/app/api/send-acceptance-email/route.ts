import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { requestId } = await req.json();
    
    // Fetch full lesson request with student details
    const lessonRequest = await prisma.lessonsRequest.findUnique({
      where: { id: requestId },
      include: {
        student: true,
        instructor: true,
        location: true
      }
    });

    if (!lessonRequest) {
      return NextResponse.json({ success: false, error: "Lesson request not found" }, { status: 404 });
    }
    
    if (!lessonRequest.student.email) {
      return NextResponse.json({ success: false, error: "Student email not found" }, { status: 400 });
    }

    // Manejar correctamente la fecha de lección sin aplicar ajustes de zona horaria
    const rawDate = new Date(lessonRequest.lessonDate);
    console.log('Fecha original de la lección:', rawDate);
    
    // Extraer la fecha ISO sin la parte de tiempo y crear una nueva fecha
    // al no especificar la hora, se crea a las 00:00 en hora local
    const dateParts = rawDate.toISOString().split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Meses en JS son 0-11
    const day = parseInt(dateParts[2]);
    
    // Crear la fecha local, respetando el día exacto sin ajuste de zona horaria
    const localDateOnly = new Date(year, month, day);
    console.log('Fecha ajustada (solo fecha, sin zona horaria):', localDateOnly);
    
    // Formatear la fecha SIN especificar zona horaria para evitar conversiones
    const lessonDate = localDateOnly.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log('Fecha formateada final:', lessonDate);

    // Send the acceptance email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Authorized sender
      to: ['vancastro038@gmail.com'], // Para pruebas, enviar al correo autorizado
      subject: `Your Lesson Request Has Been Accepted - ${lessonRequest.trackingNumber}`,
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              color: #333;
              line-height: 1.6;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #eee;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #FFCE47;
              padding: 15px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .header h1 {
              color: #333;
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              background-color: white;
              border-radius: 0 0 5px 5px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .details-table td {
              padding: 8px;
              border-bottom: 1px solid #eee;
            }
            .details-table td:first-child {
              font-weight: bold;
              width: 40%;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #777;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background-color: #FFCE47;
              color: #333;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 20px;
            }
            .confirmation-message {
              background-color: #e6f7e6;
              border-left: 4px solid #4CAF50;
              padding: 10px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Lesson Request Accepted</h1>
            </div>
            
            <div class="content">
              <p>Dear ${lessonRequest.student.name},</p>
              
              <div class="confirmation-message">
                <p>Great news! Your lesson request has been <strong>accepted</strong> by your instructor.</p>
              </div>
              
              <p>Here are the details of your upcoming lesson:</p>
              
              <table class="details-table">
                <tr>
                  <td>Instructor:</td>
                  <td>${lessonRequest.instructor.name}</td>
                </tr>
                <tr>
                  <td>Plan:</td>
                  <td>${lessonRequest.lessonPlan}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td>${lessonDate}</td>
                </tr>
                <tr>
                  <td>Time:</td>
                  <td>${lessonRequest.startTime} - ${lessonRequest.endTime}</td>
                </tr>
                <tr>
                  <td>Duration:</td>
                  <td>${lessonRequest.lessonDuration} minutes</td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>${lessonRequest.location.address}, ${lessonRequest.location.city}</td>
                </tr>
                <tr>
                  <td>Tracking Number:</td>
                  <td>${lessonRequest.trackingNumber}</td>
                </tr>
              </table>
              
              <p>This lesson has been added to your schedule. Please remember to be ready at least 10 minutes before your scheduled time.</p>
              
              <p>If you need to reschedule or have any questions, please contact us as soon as possible.</p>
              
              <p>We look forward to seeing you!</p>
              
              <a href="#" class="button">View Your Schedule</a>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Driving School. All rights reserved.</p>
              <p>If you have any questions, contact us at info@drivingschool.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Acceptance notification sent to ${lessonRequest.student.email}`,
      data 
    });
  } catch (error) {
    console.error("Error sending acceptance email:", error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to send acceptance email: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
