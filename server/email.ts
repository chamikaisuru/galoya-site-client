import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Create transporter for custom domain email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Your hosting SMTP server
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // info@galoya.lk or noreply@galoya.lk
    pass: process.env.SMTP_PASS, // Email password from your hosting cPanel
  },
  tls: {
    rejectUnauthorized: false // For self-signed certificates (some shared hosting)
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server connection failed:", error);
    console.log("Please check your SMTP settings in .env file");
  } else {
    console.log("✅ Email server is ready to send messages");
    console.log(`   Connected to: ${process.env.SMTP_HOST}`);
    console.log(`   Using email: ${process.env.SMTP_USER}`);
  }
});

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, phone, message } = data;

  // Professional email template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container { 
          max-width: 600px; 
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #DAA520, #B8860B);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content { 
          padding: 40px 30px;
        }
        .field { 
          margin-bottom: 25px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 15px;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label { 
          font-weight: 600;
          color: #DAA520;
          margin-bottom: 8px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .value { 
          color: #333;
          font-size: 15px;
          line-height: 1.6;
        }
        .message-box {
          background: #f9f9f9;
          padding: 20px;
          border-left: 4px solid #DAA520;
          margin-top: 10px;
          border-radius: 4px;
        }
        .footer { 
          background: #f9f9f9;
          text-align: center;
          padding: 30px;
          color: #666;
          font-size: 13px;
          border-top: 1px solid #e0e0e0;
        }
        .footer strong {
          color: #DAA520;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #DAA520;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📧 New Contact Inquiry</h1>
          <p>Galoya Arrack Website - www.galoya.lk</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">👤 Contact Name</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email Address</div>
            <div class="value"><a href="mailto:${email}" style="color: #DAA520; text-decoration: none;">${email}</a></div>
          </div>
          
          ${phone ? `
          <div class="field">
            <div class="label">📱 Phone Number</div>
            <div class="value"><a href="tel:${phone}" style="color: #DAA520; text-decoration: none;">${phone}</a></div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">💬 Message</div>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" class="button">Reply to ${name}</a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>Galoya Plantations (Pvt) Ltd</strong><br>
            Hingurana, Ampara, Sri Lanka
          </p>
          <p style="margin: 0; font-size: 12px; color: #999;">
            This is an automated message from your website contact form.<br>
            Received on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version (fallback)
  const textContent = `
═══════════════════════════════════════
  NEW CONTACT FORM SUBMISSION
  Galoya Arrack Website
═══════════════════════════════════════

Contact Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

───────────────────────────────────────
Reply to: ${email}
Received: ${new Date().toLocaleString()}
───────────────────────────────────────

Galoya Plantations (Pvt) Ltd
www.galoya.lk
  `;

  try {
    // Send email
    const info = await transporter.sendMail({
      from: `"Galoya Arrack Website" <${process.env.SMTP_USER}>`, // From your domain
      to: process.env.CONTACT_EMAIL_TO, // Main recipient (hr@galoya.lk)
      cc: process.env.CONTACT_EMAIL_CC, // CC recipients
      replyTo: email, // Customer's email for easy reply
      subject: `🌟 New Website Inquiry from ${name}`,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Priority': '1', // High priority
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log("✅ Email sent successfully!");
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   From: ${process.env.SMTP_USER}`);
    console.log(`   To: ${process.env.CONTACT_EMAIL_TO}`);
    if (process.env.CONTACT_EMAIL_CC) {
      console.log(`   CC: ${process.env.CONTACT_EMAIL_CC}`);
    }
    console.log(`   Reply-To: ${email}`);
    
    return info;
  } catch (error: any) {
    console.error("❌ Email sending failed!");
    console.error("   Error:", error.message);
    
    // Detailed error logging
    if (error.code === 'EAUTH') {
      console.error("   → Authentication failed. Check SMTP username and password.");
    } else if (error.code === 'ECONNECTION') {
      console.error("   → Cannot connect to SMTP server. Check host and port.");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("   → Connection timeout. Check firewall or host settings.");
    }
    
    throw error;
  }
}

// Optional: Test email configuration
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ Email server connection test passed!");
    return true;
  } catch (error: any) {
    console.error("❌ Email server connection test failed!");
    console.error("   Error:", error.message);
    return false;
  }
}