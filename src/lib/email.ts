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

export async function sendBookingConfirmation(email: string, details: { serviceName: string; price: string; date?: string; isSubscription?: boolean }) {
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
              ${details.isSubscription ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Included With:</span>
                <span style="font-weight: bold; color: #8b5cf6;">Active Subscription</span>
              </div>
              ` : `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Amount Paid:</span>
                <span style="font-weight: bold;">₦${details.price}</span>
              </div>
              `}
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

export async function sendSubscriptionConfirmation(email: string, details: {
  planName: string;
  totalCalls: number;
  billingCycle: 'monthly' | 'annual';
  amountPaid: string;
  nextBillingDate: string;
}) {
  if (!brevo) {
    console.error("❌ BREVO_API_KEY is missing in environment variables!");
    throw new Error("Email service is not configured.");
  }

  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: `${details.planName} Activated 🎉`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: #8b5cf6; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Welcome to ${details.planName}! 💜</h1>
            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 32px;">
              Your subscription is now active. You have <strong>${details.totalCalls} heartfelt calls</strong> ready to send this cycle. Book them whenever you're ready — we'll handle the rest.
            </p>

            <div style="padding: 24px; background: #fdfaf6; border-radius: 16px; border: 1px solid #eee; margin-bottom: 32px;">
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 16px;">Subscription Details</h2>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Plan:</span>
                <span style="font-weight: bold;">${details.planName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Calls this cycle:</span>
                <span style="font-weight: bold;">${details.totalCalls}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Billing cycle:</span>
                <span style="font-weight: bold; text-transform: capitalize;">${details.billingCycle}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Amount paid:</span>
                <span style="font-weight: bold;">₦${details.amountPaid}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Next billing date:</span>
                <span style="font-weight: bold;">${details.nextBillingDate}</span>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="https://buzzthrills.com/book" style="display: inline-block; padding: 16px 32px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 16px; font-weight: 900; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                Book Your First Call →
              </a>
            </div>

            <p style="text-align: center; font-size: 14px; color: #999;">
              Manage your plan in your <a href="https://buzzthrills.com/profile" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">Dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true, messageId: (data as any).messageId };
  } catch (error) {
    console.error("Brevo subscription email failed:", error);
    throw error;
  }
}

export async function sendLetterReadyEmail(email: string, details: { recipientName: string; shareUrl: string }) {
  if (!brevo) {
    console.error("❌ BREVO_API_KEY is missing in environment variables!");
    throw new Error("Email service is not configured.");
  }

  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: `Your Digital Letter for ${details.recipientName} is Ready 💌`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: #8b5cf6; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Your Letter is Live 💜</h1>
            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 32px;">
              The digital letter you created for <strong>${details.recipientName}</strong> is ready to share. Send them the link below — they'll see your message animate to life.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${details.shareUrl}" style="display: inline-block; padding: 16px 32px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 16px; font-weight: 900; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                Open Your Letter →
              </a>
            </div>

            <div style="padding: 16px; background: #fdfaf6; border-radius: 12px; border: 1px solid #eee; margin-bottom: 24px;">
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Share URL</div>
              <div style="font-size: 13px; font-family: monospace; word-break: break-all; color: #8b5cf6;">${details.shareUrl}</div>
            </div>

            <p style="text-align: center; font-size: 14px; color: #999;">
              Manage all your letters in your <a href="https://buzzthrills.com/profile" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">Dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true, messageId: (data as any).messageId };
  } catch (error) {
    console.error("Brevo letter email failed:", error);
    throw error;
  }
}

export async function sendLetterProcessingEmail(email: string, details: { recipientName: string }) {
  if (!brevo) {
    console.warn("⚠️ Email service not configured. Skipping letter processing email.");
    return;
  }

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Your Letter is Being Crafted 💜`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: #5A0C7E; font-size: 28px; font-weight: 900; margin-bottom: 24px;">Payment Confirmed — We're On It! ✨</h1>
            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 32px;">
              Your digital letter for <strong>${details.recipientName}</strong> has been paid for and is now being prepared by our team.
              We'll personalise every detail and notify you the moment it's ready to share.
            </p>

            <div style="padding: 24px; background: #f9f4ff; border-radius: 16px; border: 1px solid #e9d8ff; margin-bottom: 32px;">
              <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #5A0C7E; margin-bottom: 12px;">What Happens Next</h2>
              <ol style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                <li>Our team reviews your brief and crafts your letter</li>
                <li>We add the requested voice recording or other touches</li>
                <li>You receive an email with your live share link</li>
                <li>Share the link — your recipient opens it to a beautiful experience</li>
              </ol>
            </div>

            <p style="text-align: center; font-size: 14px; color: #999;">
              Track your letter status in your <a href="https://buzzthrillsprime.com/profile" style="color: #5A0C7E; text-decoration: none; font-weight: bold;">Dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Brevo letter processing email failed:", error);
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

export async function sendCallAssignmentEmail(email: string, details: {
  staffName: string;
  recipientName: string;
  recipientPhone: string;
  occasionType: string;
  occasionDate: string;
  scheduledSlot: string;
}) {
  if (!brevo) {
    console.warn("⚠️ Email service not configured. Skipping call assignment email.");
    return;
  }

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `New Call Assigned: ${details.recipientName}`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fafafa;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: #8b5cf6; font-size: 26px; font-weight: 900; margin-bottom: 24px;">A call has been assigned to you</h1>

            <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 32px;">
              Hi ${details.staffName}, you've been assigned to handle the following call:
            </p>

            <div style="padding: 24px; background: #f8f8fb; border-radius: 16px; border: 1px solid #eee; margin-bottom: 32px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #444;"><strong>Recipient:</strong> ${details.recipientName} (${details.recipientPhone})</p>
              <p style="margin: 0 0 10px; font-size: 14px; color: #444;"><strong>Occasion:</strong> ${details.occasionType}</p>
              <p style="margin: 0; font-size: 14px; color: #444;"><strong>Scheduled:</strong> ${details.occasionDate} &middot; ${details.scheduledSlot}</p>
            </div>

            <div style="text-align: center;">
              <a href="https://buzzthrills.com/admin/calls" style="display: inline-block; padding: 16px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send call assignment email:", error);
  }
}

export async function sendAdminAlertEmail(subject: string, message: string, context?: Record<string, unknown>) {
  if (!brevo) {
    console.warn("⚠️ Email service not configured. Skipping admin alert:", subject, message, context);
    return;
  }

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `⚠️ ${subject}`,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: SENDER_EMAIL }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; background: #fff;">
          <h1 style="color: #b91c1c; font-size: 22px; font-weight: 900; margin-bottom: 20px;">${subject}</h1>
          <p style="font-size: 15px; color: #333; margin-bottom: 20px; white-space: pre-wrap;">${message}</p>
          ${context ? `<pre style="background:#f8f8f8; padding: 16px; border-radius: 12px; font-size: 12px; overflow-x: auto;">${JSON.stringify(context, null, 2)}</pre>` : ""}
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin alert email:", error);
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
