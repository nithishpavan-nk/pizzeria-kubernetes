const nodemailer = require('nodemailer');

// SMTP config comes from environment variables — see server/.env.example.
// Works with Gmail (app password), Mailtrap, SendGrid SMTP, or any standard SMTP host.
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn(
      '[email] SMTP credentials not fully set — emails will be logged instead of sent. ' +
      'Fill in server/.env to enable real email delivery.'
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  return transporter;
}

function formatOrderEmailHtml(order, items) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.item_name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${Number(item.unit_price).toFixed(2)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${(item.unit_price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #3D2B1F;">
    <h2 style="color:#C1432E;">Order Confirmed — Nithish Pizzeria</h2>
    <p>Hi ${order.customer_name}, thanks for your order! Here's what we're firing up:</p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      <thead>
        <tr style="text-align:left;border-bottom:2px solid #1C1410;">
          <th style="padding:8px 0;">Item</th>
          <th style="padding:8px 0;text-align:center;">Qty</th>
          <th style="padding:8px 0;text-align:right;">Price</th>
          <th style="padding:8px 0;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;font-size:18px;font-weight:bold;margin-top:12px;">
      Total: $${Number(order.total_amount).toFixed(2)}
    </p>
    <p style="margin-top:24px;">Order #${order.id} &middot; Status: ${order.status}</p>
    <p style="color:#777;font-size:13px;margin-top:32px;">
      Delivering to: ${order.delivery_address || 'pickup'}
    </p>
  </div>`;
}

/**
 * Sends an order confirmation email. If SMTP isn't configured, logs instead
 * of throwing — so order creation never fails just because email isn't set up yet.
 */
async function sendOrderConfirmationEmail(order, items) {
  const html = formatOrderEmailHtml(order, items);
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`[email] (not sent — no SMTP config) would email ${order.customer_email}:\n`, html);
    return { sent: false, reason: 'smtp_not_configured' };
  }

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || `"Nithish Pizzeria" <${process.env.SMTP_USER}>`,
      to: order.customer_email,
      subject: `Order Confirmed — #${order.id} | Nithish Pizzeria`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[email] Failed to send order confirmation:', err.message);
    return { sent: false, reason: 'send_failed', error: err.message };
  }
}

module.exports = { sendOrderConfirmationEmail };
