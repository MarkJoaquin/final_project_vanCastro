import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { requestId } = await req.json();
    
    // Fetch full lesson request with student and instructor details
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

    // Send the booking confirmation email to the student
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Authorized sender
      to: ['vancastro038@gmail.com'], // Para pruebas, enviar al correo autorizado // ${lessonRequest.student.email}
      subject: `Your Lesson Request Has Been Received - ${lessonRequest.trackingNumber}`,
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
            .tracking-number {
              background-color: #f5f5f5;
              padding: 10px;
              margin: 15px 0;
              text-align: center;
              border-radius: 5px;
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Booking Request Confirmation</h1>
            </div>
            
            <div class="content">
              <p>Dear ${lessonRequest.student.name},</p>
              
              <div class="confirmation-message">
                <p>Thank you for your lesson request! Your booking has been received and will be reviewed by the instructor.</p>
              </div>
              
              <div class="tracking-number">
                Tracking Number: ${lessonRequest.trackingNumber}
              </div>
              
              <p>Here are the details of your requested lesson:</p>
              
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
                ${lessonRequest.licenseClass ? `
                <tr>
                  <td>License Class:</td>
                  <td>${lessonRequest.licenseClass}</td>
                </tr>` : ''}
              </table>
              
              <p><strong>What happens next?</strong></p>
              <ol>
                <li>Your instructor will review your request.</li>
                <li>You will receive an invoice if your request is accepted.</li>
                <li>Once payment is completed, your lesson will be confirmed.</li>
                <li>You'll receive a final confirmation email with your lesson details.</li>
              </ol>
              
              <p>If you need to make changes or have any questions, please contact us as soon as possible.</p>
              
              <p>You can use your tracking number to follow the status of your request.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://final-project-van-castro.vercel.app/booking'}" class="button">Track Your Request</a>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} VanCastro Driving School. All rights reserved.</p>
              <p>If you have any questions, contact us at info@vancastro.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Booking confirmation email sent to ${lessonRequest.student.email}`,
      data 
    });
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to send booking confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
