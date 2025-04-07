const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory token storage (no database needed)
const tokenStore = new Map();

// Simulated users (you can later connect real users)
const users = [
  { email: 'example@mail.com', username: 'testuser', password: 'old-password' },
];

// 🚀 Send reset password email
app.post('/auth/request-password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: 'No user found with this email.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  tokenStore.set(token, { email, expires: Date.now() + 30 * 60 * 1000 }); // 30 mins

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'YOUR_GMAIL@gmail.com',
        pass: 'YOUR_APP_PASSWORD', // Use App password if 2FA enabled!
      },
    });

    const mailOptions = {
      from: '"Chipstok Support" <YOUR_GMAIL@gmail.com>',
      to: email,
      subject: 'Reset your Chipstok password',
      html: `
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <img src="YOUR_LOGO_URL" alt="Chipstok Logo" width="120" style="margin-bottom: 20px;" />
          <h2>Reset your password</h2>
          <p>We received a request to reset your password.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0080D1; color: white; text-decoration: none; border-radius: 4px;">Click here to change your password</a>
          <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email.' });
  }
});

// 🚀 Reset password
app.post('/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  const tokenData = tokenStore.get(token);

  if (!tokenData || tokenData.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }

  const user = users.find(u => u.email === tokenData.email);

  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  user.password = password; // ⚠️ In real app: Hash the password!
  tokenStore.delete(token);

  console.log(`Password for ${user.email} changed to: ${password}`);
  res.json({ message: 'Password reset successful!' });
});

// Start server
app.listen(5000, () => {
    console.log('✅ Backend running at http://localhost:5000');
  });
  
  