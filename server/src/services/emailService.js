const nodemailer = require('nodemailer');
const { createTransporter } = require('../config/mailer');

/**
 * Priority colour map for HTML email badges.
 */
const PRIORITY_COLORS = {
  High:   { bg: '#fee2e2', text: '#991b1b' },
  Medium: { bg: '#fef9c3', text: '#854d0e' },
  Low:    { bg: '#dcfce7', text: '#166534' },
};

/**
 * Builds the HTML email body for a new lead notification.
 */
const buildEmailHtml = (lead) => {
  const priority = lead.priority || 'Medium';
  const colors   = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Medium;
  const date     = new Date(lead.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Inter,Arial,sans-serif;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🎯 New Lead Received</h1>
            <p style="margin:8px 0 0;color:#c7d2fe;font-size:14px;">${date}</p>
          </td>
        </tr>

        <!-- Priority Badge -->
        <tr>
          <td style="padding:24px 40px 0;">
            <span style="display:inline-block;padding:4px 14px;border-radius:999px;font-size:13px;font-weight:600;background:${colors.bg};color:${colors.text};">
              ${priority} Priority
            </span>
          </td>
        </tr>

        <!-- Contact Info -->
        <tr>
          <td style="padding:20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Name</p>
                  <p style="margin:4px 0 0;color:#111827;font-size:16px;font-weight:600;">${lead.name}</p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Email</p>
                  <a href="mailto:${lead.email}" style="margin:4px 0 0;display:block;color:#4f46e5;font-size:15px;">${lead.email}</a>
                </td>
              </tr>
              ${lead.phone ? `
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Phone</p>
                  <p style="margin:4px 0 0;color:#111827;font-size:15px;">${lead.phone}</p>
                </td>
              </tr>` : ''}
              ${lead.company ? `
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Company</p>
                  <p style="margin:4px 0 0;color:#111827;font-size:15px;">${lead.company}</p>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Service Type</p>
                  <p style="margin:4px 0 0;color:#111827;font-size:15px;">${lead.serviceType}</p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Category</p>
                  <p style="margin:4px 0 0;color:#111827;font-size:15px;">${lead.category}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- AI Summary -->
        ${lead.aiSummary ? `
        <tr>
          <td style="padding:0 40px 20px;">
            <div style="background:#f0f9ff;border-left:4px solid #6366f1;border-radius:6px;padding:16px;">
              <p style="margin:0 0 6px;color:#4f46e5;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">🤖 AI Summary</p>
              <p style="margin:0;color:#1e3a5f;font-size:14px;line-height:1.6;">${lead.aiSummary}</p>
            </div>
          </td>
        </tr>` : ''}

        <!-- Original Message -->
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Original Message</p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
              <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">${lead.message}</p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
              AI Lead Management System · Reply to this email to contact the lead directly.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

/**
 * Sends a new lead notification email to the business owner.
 * @param {object} lead - Mongoose Lead document
 */
const sendLeadNotificationEmail = async (lead) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
    console.warn('[emailService] Email env vars not configured — skipping.');
    return;
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from:    `"AI Lead System" <${process.env.EMAIL_USER}>`,
      to:      process.env.ADMIN_EMAIL,
      replyTo: lead.email,
      subject: `[${lead.priority} Priority] New Lead: ${lead.name} — ${lead.serviceType}`,
      html:    buildEmailHtml(lead),
    });

    console.log(`[emailService] Notification sent for lead: ${lead.email}`);
  } catch (error) {
    console.error('[emailService] Failed to send email:', error.message);
    // Non-fatal — lead is already saved in MongoDB
  }
};

module.exports = { sendLeadNotificationEmail };
