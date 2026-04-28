import { BrevoClient } from "@getbrevo/brevo";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "hello@buzzthrillsprime.com";
const SENDER_NAME = "BuzzThrills";

// Initialize Brevo Client
const brevo = BREVO_API_KEY ? new BrevoClient({
  apiKey: BREVO_API_KEY,
}) : null;

export async function sendOTPEmail(email: string, otp: string) {
  if (!brevo) {
    console.error("❌ BREVO_API_KEY is missing in environment variables!");
    throw new Error("Email service is not configured.");
  }

  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Your BuzzThrills Activation Code 🎁",
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #fff; color: #000;">
          <h1 style="color: #8b5cf6; font-size: 32px; font-weight: 900; margin-bottom: 20px;">Welcome to the Family! ❤️</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 30px;">Your magic activation code is:</p>
          <div style="font-size: 54px; font-weight: 900; letter-spacing: 12px; padding: 30px; background: #f8f8f8; border-radius: 20px; color: #8b5cf6; display: inline-block; margin-bottom: 30px;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px;">This code expires in 10 minutes. Go use it to access your dashboard!</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #ccc; font-size: 12px;">
            If you didn't request this, you can safely ignore this email.
          </div>
        </div>
      `,
    });
    return { success: true, messageId: (data as any).messageId };
  } catch (error) {
    console.error("Brevo delivery failed:", error);
    throw error;
  }
}

export async function sendResetOTPEmail(email: string, otp: string) {
  if (!brevo) {
    console.error("❌ BREVO_API_KEY is missing in environment variables!");
    throw new Error("Email service is not configured.");
  }

  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Reset Your BuzzThrills Password 🔑",
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #fff; color: #000;">
          <h1 style="color: #8b5cf6; font-size: 32px; font-weight: 900; margin-bottom: 20px;">Forgot Your Password? 🔒</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 30px;">It happens to the best of us. Use this magic code to reset it:</p>
          <div style="font-size: 54px; font-weight: 900; letter-spacing: 12px; padding: 30px; background: #f8f8f8; border-radius: 20px; color: #8b5cf6; display: inline-block; margin-bottom: 30px;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });
    return { success: true, messageId: (data as any).messageId };
  } catch (error) {
    console.error("Brevo reset email delivery failed:", error);
    throw error;
  }
}

export async function sendBookingConfirmation(email: string, details: { serviceName: string; price: string; date?: string }) {
  if (!brevo) {
    console.error("❌ BREVO_API_KEY is missing in environment variables!");
    throw new Error("Email service is not configured.");
  }

  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: `Booking Confirmed: ${details.serviceName} 🎊`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: #8b5cf6; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Thrills are Loading! 🚀</h1>
            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 32px;">
              Your booking for <strong>${details.serviceName}</strong> has been confirmed. We're getting our agents ready to create a core memory.
            </p>
            
            <div style="padding: 24px; background: #fdfaf6; border-radius: 16px; border: 1px solid #eee; margin-bottom: 32px;">
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 16px;">Booking Details</h2>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Service:</span>
                <span style="font-weight: bold;">${details.serviceName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Amount Paid:</span>
                <span style="font-weight: bold;">₦${details.price}</span>
              </div>
              ${details.date ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Date:</span>
                <span style="font-weight: bold;">${details.date}</span>
              </div>
              ` : ''}
            </div>

            <p style="text-align: center; font-size: 14px; color: #999;">
              You can track your bookings in your <a href="https://buzzthrills.com/profile" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">Dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true, messageId: (data as any).messageId };
  } catch (error) {
    console.error("Brevo booking email failed:", error);
    throw error;
  }
}

export async function sendCallStatusUpdate(email: string, details: { 
  status: string; 
  recipientName: string; 
  recordingUrl?: string; 
  adminNotes?: string; 
  failureReason?: string;
}) {
  if (!brevo) {
    console.warn("⚠️ Email service not configured. Skipping status update email.");
    return;
  }

  const isDelivered = details.status === 'delivered';
  const subject = isDelivered 
    ? `Engagement Delivered: For ${details.recipientName} ❤️` 
    : `Update: Your Engagement for ${details.recipientName} ⚠️`;

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: ${isDelivered ? '#8b5cf6' : '#f59e0b'}; font-size: 28px; font-weight: 900; margin-bottom: 24px;">
              ${isDelivered ? 'Engagement Completed! 🎉' : 'Engagement Update 📋'}
            </h1>
            
            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 32px;">
              Your scheduled engagement for <strong>${details.recipientName}</strong> has been marked as <strong>${details.status.toUpperCase()}</strong>.
            </p>

            ${isDelivered && details.recordingUrl ? `
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="font-size: 14px; color: #666; margin-bottom: 16px;">Hear how it went:</p>
              <a href="${details.recordingUrl}" style="display: inline-block; padding: 16px 32px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 16px; font-weight: 900; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                Play Voice Proof 🎧
              </a>
            </div>
            ` : ''}

            ${details.adminNotes ? `
            <div style="padding: 24px; background: #fdfaf6; border-radius: 16px; border: 1px solid #eee; margin-bottom: 32px;">
              <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 12px;">Notes from our Agent</h2>
              <p style="font-size: 14px; color: #444; font-style: italic; margin: 0;">"${details.adminNotes}"</p>
            </div>
            ` : ''}

            ${details.failureReason ? `
            <div style="padding: 24px; background: #fff1f2; border-radius: 16px; border: 1px solid #fee2e2; margin-bottom: 32px;">
              <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #e11d48; margin-bottom: 12px;">Operational Reason</h2>
              <p style="font-size: 14px; color: #be123c; margin: 0;">${details.failureReason}</p>
            </div>
            ` : ''}

            <p style="text-align: center; font-size: 14px; color: #999; margin-top: 40px;">
              View more details in your <a href="https://buzzthrills.com/profile" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">Dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send status update email:", error);
  }
}

export async function sendAdminCallNotification(callDetails: any[]) {
  if (!brevo) {
    console.warn("⚠️ Email service not configured. Skipping admin notification.");
    return;
  }

  try {
    const adminEmail = SENDER_EMAIL; // Notify the primary business email
    const callListHtml = callDetails.map(c => `
      <li style="margin-bottom: 15px; padding: 15px; background: #f8f8f8; border-radius: 12px; list-style: none;">
        <strong style="color: #8b5cf6;">Recipient:</strong> ${c.recipient_name} (${c.recipient_phone})<br/>
        <strong style="color: #8b5cf6;">Type:</strong> ${c.occasion_type} (${c.call_type})<br/>
        <strong style="color: #8b5cf6;">Scheduled:</strong> ${c.occasion_date} | ${c.scheduled_slot}
      </li>
    `).join('');

    await brevo.transactionalEmails.sendTransacEmail({
      subject: `🚨 NEW BOOKING: ${callDetails.length} New Call(s) Scheduled!`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: adminEmail }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fff;">
          <h1 style="color: #000; font-size: 24px; font-weight: 900; margin-bottom: 20px;">New Order Received! 💰</h1>
          <p style="font-size: 16px; color: #666; margin-bottom: 30px;">The following engagements have been booked and are awaiting assignment:</p>
          <ul style="padding: 0;">
            ${callListHtml}
          </ul>
          <div style="margin-top: 40px; text-align: center;">
            <a href="https://buzzthrills.com/admin/calls" style="display: inline-block; padding: 16px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold;">
              Go to Admin Dashboard
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}
