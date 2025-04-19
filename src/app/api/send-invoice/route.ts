import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { generateContract } from "@/lib/generateContract";

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

    // Generate a formatted date for the invoice in Vancouver time zone
    const invoiceDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Vancouver'
    });

    // Manejar correctamente la fecha de lección sin aplicar ajustes de zona horaria
    const rawDate = new Date(lessonRequest.lessonDate);
    // console.log('Fecha original de la lección:', rawDate);
    
    // Extraer la fecha ISO sin la parte de tiempo y crear una nueva fecha
    // al no especificar la hora, se crea a las 00:00 en hora local
    const dateParts = rawDate.toISOString().split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Meses en JS son 0-11
    const day = parseInt(dateParts[2]);
    
    // Crear la fecha local, respetando el día exacto sin ajuste de zona horaria
    const localDateOnly = new Date(year, month, day);
    // console.log('Fecha ajustada (solo fecha, sin zona horaria):', localDateOnly);
    
    // Formatear la fecha SIN especificar zona horaria para evitar conversiones
    const lessonDate = localDateOnly.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // console.log('Fecha formateada final:', lessonDate);

    // Actualizar el estado de la solicitud a AWAITING_PAYMENT
    const updatedLessonRequest = await prisma.lessonsRequest.update({
      where: { id: requestId },
      data: {
        lessonStatus: "AWAITING_PAYMENT",
        updatedAt: new Date()
      }
    });

    // Generar el contrato en PDF
    const contractPdfBase64 = generateContract(
      lessonRequest.student.name || 'Estudiante',
      lessonDate,
      `${lessonRequest.startTime} - ${lessonRequest.endTime}`,
      lessonRequest.trackingNumber,
      `${lessonRequest.location.address}, ${lessonRequest.location.city}`,
      lessonRequest.lessonPlan,
      Number(lessonRequest.lessonPrice) // Convertir a número para cumplir con el tipo esperado
    );
    
    // Extraer solo la parte Base64 del string (eliminar el prefijo "data:application/pdf;base64,")
    const pdfBase64Content = contractPdfBase64.split(',')[1];

    // Send the invoice email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Authorized sender
      to: ['vancastro038@gmail.com'], // Para pruebas, enviar al correo autorizado, para el estudiante: ${lessonRequest.student.email}
      subject: `Your Lesson Invoice - ${lessonRequest.trackingNumber} - VanCastro Driving School`,
      attachments: [
        {
          filename: `Contrato-${lessonRequest.trackingNumber}.pdf`,
          content: pdfBase64Content
        }
      ],
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              color: #333;
              line-height: 1.6;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .invoice-header h1 {
              color: #FFCE47;
              font-size: 28px;
              margin: 0;
            }
            .invoice-company {
              text-align: right;
            }
            .invoice-company h2 {
              margin: 0;
              color: #333;
              font-size: 18px;
            }
            .invoice-details, .invoice-customer {
              margin-bottom: 30px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .invoice-table th {
              background-color: #FFCE47;
              color: white;
              padding: 10px;
              text-align: left;
            }
            .invoice-table td {
              padding: 10px;
              border-bottom: 1px solid #eee;
            }
            .invoice-table tfoot td {
              background: #f8f8f8;
              font-weight: bold;
            }
            .invoice-footer {
              margin-top: 30px;
              font-size: 14px;
              color: #777;
              text-align: center;
            }
            .invoice-footer p {
              margin: 5px 0;
            }
            .thank-you {
              font-size: 20px;
              color: #FFCE47;
              text-align: center;
              margin-top: 20px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div>
                <h1>INVOICE</h1>
                <p><strong>Invoice #:</strong> ${lessonRequest.trackingNumber}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
              </div>
              <div class="invoice-company">
                <h2>Driving School</h2>
                <p>123 Driving Lane</p>
                <p>Vancouver, BC</p>
                <p>Canada</p>
                <p>Email: info@drivingschool.com</p>
              </div>
            </div>
            
            <div class="invoice-customer">
              <h3>BILLED TO:</h3>
              <p><strong>Name:</strong> ${lessonRequest.student.name}</p>
              <p><strong>Email:</strong> ${lessonRequest.student.email}</p>
            </div>
            
            <div class="invoice-details">
              <h3>LESSON DETAILS:</h3>
              <p><strong>Instructor:</strong> ${lessonRequest.instructor.name}</p>
              <p><strong>Plan:</strong> ${lessonRequest.lessonPlan}</p>
              <p><strong>Date:</strong> ${lessonDate}</p>
              <p><strong>Time:</strong> ${lessonRequest.startTime} - ${lessonRequest.endTime}</p>
              <p><strong>Duration:</strong> ${lessonRequest.lessonDuration} minutes</p>
              <p><strong>Location:</strong> ${lessonRequest.location.address}, ${lessonRequest.location.city}</p>
              ${lessonRequest.licenseClass ? `<p><strong>License Class:</strong> ${lessonRequest.licenseClass}</p>` : ''}
            </div>
            
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${lessonRequest.lessonPlan} - ${lessonRequest.lessonDuration} min Driving Lesson</td>
                  <td>1</td>
                  <td>$${lessonRequest.lessonPrice}</td>
                  <td>$${lessonRequest.lessonPrice}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right;">Total:</td>
                  <td>$${lessonRequest.lessonPrice}</td>
                </tr>
              </tfoot>
            </table>
            
            <div class="thank-you">
              Thank You For Your Business!
            </div>
            
            <div class="invoice-footer">
              <p>Payment is due upon receipt of this invoice.</p>
              <p>Please reference your tracking number (${lessonRequest.trackingNumber}) in all communications.</p>
              <p>If you have any questions about this invoice, please contact us at billing@drivingschool.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Invoice sent to ${lessonRequest.student.email}`,
      data,
      lessonRequest: updatedLessonRequest
    });
  } catch (error) {
    console.error("Error sending invoice:", error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to send invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
