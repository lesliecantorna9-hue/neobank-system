const fs = require('fs');
const path = require('path');

// Try to require nodemailer if present. If it's not installed, we'll skip sending email
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: JSON.stringify({ message: 'Invalid JSON' }) }; }
  const { email } = body;
  if (!email) return { statusCode: 400, body: JSON.stringify({ message: 'Email is required' }) };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  const dataDir = path.join(__dirname, '_data');
  const filePath = path.join(dataDir, 'otps.json');

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    let otps = [];
    try { otps = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]'); } catch (e) { otps = []; }
    otps = otps.filter(o => o.email !== email);
    otps.push({ email, otp, expiresAt });
    fs.writeFileSync(filePath, JSON.stringify(otps, null, 2), 'utf8');
    console.log('OTP generated for', email, otp);

    // Send email if nodemailer is available and EMAIL creds are set
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

    if (nodemailer && EMAIL_USER && EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: EMAIL_USER, pass: EMAIL_PASS }
        });

        const mailOptions = {
          from: EMAIL_FROM,
          to: email,
          subject: 'Your NEO BANK verification code',
          text: `Your verification code is ${otp}. It expires in 5 minutes.`,
          html: `<p>Your verification code is <b>${otp}</b>. It expires in 5 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent to', email);

        // In production, do not return the OTP in the response
        if (process.env.NODE_ENV === 'production') {
          return { statusCode: 200, body: JSON.stringify({ message: 'OTP sent' }) };
        }
        // In non-production environments, include the OTP for easier testing
        return { statusCode: 200, body: JSON.stringify({ message: 'OTP generated (dev)', otp, emailSent: true }) };
      } catch (err) {
        console.error('Email send failed:', err);
        // Fall through to return OTP for dev testing
        return { statusCode: 200, body: JSON.stringify({ message: 'OTP generated (dev, email failed)', otp }) };
      }
    }

    // Fallback: nodemailer not available or creds missing — return OTP for dev testing
    return { statusCode: 200, body: JSON.stringify({ message: 'OTP generated (dev)', otp, emailSent: false }) };
  } catch (err) {
    console.error('send-otp error', err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
