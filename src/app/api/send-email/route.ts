import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();
    console.log(name, phone, email, message);

    // Generar un ID de mensaje único para referencia
    const messageId = `MSG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;    
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Authorized sender
      to: "vancastro038@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
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
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            .details-table td:first-child {
              font-weight: bold;
              width: 30%;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #777;
              font-size: 14px;
            }
            .message-box {
              background-color: #f5f5f5;
              border-left: 4px solid #FFCE47;
              padding: 15px;
              margin: 15px 0;
              border-radius: 0 5px 5px 0;
            }
            .message-id {
              background-color: #f5f5f5;
              padding: 10px;
              margin: 15px 0;
              text-align: center;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
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
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>New Contact Message</h1>
            </div>
            
            <div class="content">
              <p>A new message has been received through the contact form on your website.</p>
              
              <div class="message-id">
                Message ID: ${messageId}
              </div>
              
              <p>Here are the details of the message:</p>
              
              <table class="details-table">
                <tr>
                  <td>Date:</td>
                  <td>${currentDate}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>${name}</td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>${phone}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td><a href="mailto:${email}">${email}</a></td>
                </tr>
              </table>
              
              <p><strong>Message:</strong></p>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <p><strong>Actions:</strong></p>
              <p>You can reply directly to this email to respond to the sender.</p>
              
              <a href="mailto:${email}?subject=RE: Your message to VanCastro Driving School" class="button">Reply to ${name}</a>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} VanCastro Driving School. All rights reserved.</p>
              <p>This is an automated message from your website contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email, // Allow users to reply to the email
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" });
  }
}
