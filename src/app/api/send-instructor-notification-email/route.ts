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
    
    if (!lessonRequest.instructor.email) {
      return NextResponse.json({ success: false, error: "Instructor email not found" }, { status: 400 });
    }

    // Manejar correctamente la fecha de lección sin aplicar ajustes de zona horaria
    const rawDate = new Date(lessonRequest.lessonDate);
    
    // Extraer la fecha ISO sin la parte de tiempo y crear una nueva fecha
    const dateParts = rawDate.toISOString().split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Meses en JS son 0-11
    const day = parseInt(dateParts[2]);
    
    // Crear la fecha local, respetando el día exacto sin ajuste de zona horaria
    const localDateOnly = new Date(year, month, day);
    
    // Formatear la fecha SIN especificar zona horaria para evitar conversiones
    const lessonDate = localDateOnly.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send the notification email to the instructor
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Authorized sender
      to: ['vancastro038@gmail.com'], // Para pruebas, enviar al correo autorizado // para el instructor seria: ${lessonRequest.instructor.email}

      subject: `New Lesson Request - ${lessonRequest.trackingNumber}`,
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
            .notification-message {
              background-color: #f0f7ff;
              border-left: 4px solid #0066cc;
              padding: 10px;
              margin: 15px 0;
            }
            .action-buttons {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
            }
            .action-buttons a {
              flex-basis: 48%;
              text-align: center;
            }
            .accept-button {
              background-color: #4CAF50;
              color: white;
            }
            .review-button {
              background-color: #FFCE47;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>New Lesson Request</h1>
            </div>
            
            <div class="content">
              <p>Hello ${lessonRequest.instructor.name},</p>
              
              <div class="notification-message">
                <p>You have received a new lesson request from <strong>${lessonRequest.student.name}</strong>.</p>
              </div>
              
              <p>Here are the details of the requested lesson:</p>
              
              <table class="details-table">
                <tr>
                  <td>Student:</td>
                  <td>${lessonRequest.student.name}</td>
                </tr>
                <tr>
                  <td>Contact:</td>
                  <td>${lessonRequest.student.email || 'Not provided'}</td>
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
                ${lessonRequest.licenseClass ? `
                <tr>
                  <td>License Class:</td>
                  <td>${lessonRequest.licenseClass}</td>
                </tr>` : ''}
              </table>
              
              <p>Please review this request in your instructor dashboard and either accept or decline the lesson.</p>
              
              <div class="action-buttons">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://final-project-van-castro.vercel.app/admin/booking-request'}" class="button review-button">Review Request</a>
              </div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} VanCastro Driving School. All rights reserved.</p>
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Instructor notification email sent to ${lessonRequest.instructor.email}`,
      data 
    });
  } catch (error) {
    console.error("Error sending instructor notification email:", error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to send instructor notification email: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
