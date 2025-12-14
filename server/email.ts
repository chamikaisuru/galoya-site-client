import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, phone, message } = data;

  // Email template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #DAA520; margin-bottom: 5px; }
        .value { padding: 10px; background: white; border-left: 3px solid #DAA520; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Galoya Arrack Website</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${email}</div>
          </div>
          ${phone ? `
          <div class="field">
            <div class="label">📱 Phone:</div>
            <div class="value">${phone}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">💬 Message:</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the Galoya Arrack contact form</p>
          <p>© ${new Date().getFullYear()} Galoya Plantations, Sri Lanka</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const textContent = `
    New Contact Form Submission - Galoya Arrack Website
    
    Name: ${name}
    Email: ${email}
    ${phone ? `Phone: ${phone}` : ''}
    
    Message:
    ${message}
    
    ---
    This email was sent from the Galoya Arrack contact form
  `;

  try {
    // Send email to primary recipient with CC
    const info = await transporter.sendMail({
      from: `"Galoya Arrack Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL_TO, // Main recipient (galoyaplantation HR)
      cc: process.env.CONTACT_EMAIL_CC, // CC recipients (comma-separated)
      replyTo: email, // Reply to customer's email
      subject: `New Contact Form: ${name}`,
      text: textContent,
      html: htmlContent,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
}