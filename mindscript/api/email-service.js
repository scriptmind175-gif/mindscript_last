const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  // For production, use environment variables
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  };

  // Email configuration loaded

  return nodemailer.createTransport(emailConfig);
};

// Email template for registration confirmation
const createRegistrationEmailTemplate = (registrationData) => {
  const { name, email, courseName, amount, paymentId } = registrationData;
  
  return {
    from: `"MindScript" <${process.env.EMAIL_USER || 'noreply@mindscript.online'}>`,
    to: email,
    subject: `🎉 Welcome to ${courseName} - Registration Confirmed!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            background: linear-gradient(135deg, #3399cc, #2980b9);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            margin: -30px -30px 30px -30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .tagline {
            font-size: 16px;
            opacity: 0.9;
          }
          .success-icon {
            font-size: 48px;
            margin: 20px 0;
          }
          .course-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3399cc;
          }
          .course-name {
            font-size: 20px;
            font-weight: bold;
            color: #3399cc;
            margin-bottom: 10px;
          }
          .amount {
            font-size: 18px;
            font-weight: bold;
            color: #27ae60;
          }
          .payment-id {
            font-size: 12px;
            color: #666;
            margin-top: 10px;
          }
          .next-steps {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .next-steps h3 {
            color: #27ae60;
            margin-top: 0;
          }
          .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .contact-info {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: #3399cc;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
            font-weight: bold;
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .container { padding: 20px; }
            .header { margin: -20px -20px 20px -20px; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🧠 MindScript</div>
            <div class="tagline">Where Mind Learns the Script</div>
          </div>
          
          <div style="text-align: center;">
            <div class="success-icon">✅</div>
            <h1 style="color: #27ae60; margin: 0;">Registration Successful!</h1>
            <p style="font-size: 18px; margin: 10px 0;">Welcome to the MindScript family, ${name}!</p>
          </div>
          
          <div class="course-details">
            <div class="course-name">${courseName}</div>
            <div class="amount">Amount Paid: ₹${amount}</div>
            <div class="payment-id">Payment ID: ${paymentId}</div>
          </div>
          
          <div class="next-steps">
            <h3>🚀 What's Next?</h3>
            <ul>
              <li><strong>Course Access:</strong> You will receive course access details within 24 hours</li>
              <li><strong>Welcome Email:</strong> Check your inbox for detailed course information</li>
              <li><strong>Community Access:</strong> Join our exclusive student community</li>
              <li><strong>Support:</strong> Our team is here to help you succeed</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or need assistance, don't hesitate to reach out:</p>
            <p>
              <strong>Email:</strong> support@mindscript.online<br>
              <strong>Phone:</strong> +91-9876543210<br>
              <strong>Website:</strong> <a href="https://mindscript.online">mindscript.online</a>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://mindscript.online" class="button">Visit Our Website</a>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing MindScript for your learning journey!</p>
            <p>© 2024 MindScript. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to MindScript, ${name}!
      
      Your registration for "${courseName}" has been confirmed.
      
      Course Details:
      - Course: ${courseName}
      - Amount Paid: ₹${amount}
      - Payment ID: ${paymentId}
      
      What's Next:
      - You will receive course access details within 24 hours
      - Check your email for detailed course information
      - Join our exclusive student community
      
      Need Help?
      Email: support@mindscript.online
      Phone: +91-9876543210
      Website: https://mindscript.online
      
      Thank you for choosing MindScript!
      
      © 2024 MindScript. All rights reserved.
    `
  };
};

// Send registration confirmation email
const sendRegistrationEmail = async (registrationData) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection first
    await transporter.verify();
    
    const emailTemplate = createRegistrationEmailTemplate(registrationData);
    const info = await transporter.sendMail(emailTemplate);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationEmail,
  createRegistrationEmailTemplate
};
