const nodemailer = require('nodemailer');

/**
 * Creates and returns a Nodemailer transporter.
 * Supports Gmail SMTP (and any compatible SMTP service).
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

module.exports = { createTransporter };
