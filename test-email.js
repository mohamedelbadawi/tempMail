const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  if (process.argv.length < 3) {
    console.log('Usage: node test-email.js <recipient-email>');
    console.log('Example: node test-email.js abc123@localhost');
    process.exit(1);
  }

  const recipient = process.argv[2];
  const smtpPort = process.env.SMTP_PORT || 2525;

  console.log(`Sending test email to: ${recipient}`);
  console.log(`Using SMTP server: localhost:${smtpPort}`);

  const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: smtpPort,
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: 'test-sender@example.com',
      to: recipient,
      subject: 'Welcome to TempMail! 🎉',
      text: 'This is a test email from TempMail service. If you can read this, everything is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0ea5e9;">Welcome to TempMail! 🎉</h1>
          <p>This is a test email from your TempMail service.</p>
          <p>If you can read this, everything is working correctly!</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <h2>Features:</h2>
          <ul>
            <li>✅ Real-time email reception</li>
            <li>✅ Custom email naming</li>
            <li>✅ Email history storage</li>
            <li>✅ Modern UI with dark mode</li>
          </ul>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This is an automated test message from TempMail.
          </p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your TempMail inbox to see the email.');
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    process.exit(1);
  }
}

sendTestEmail();
