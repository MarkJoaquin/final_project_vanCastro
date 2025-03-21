import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();
    console.log(name, phone, email, message);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Athorized sender
      to: ["vancastro038@gmail.com",'markjoaquin2@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>They have reached out to you through your website contact form.</p>
      `,
      replyTo: email, //Allow users to reply to the email
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" });
  }
}
