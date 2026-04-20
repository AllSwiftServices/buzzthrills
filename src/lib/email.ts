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
    console.warn("⚠️  BREVO_API_KEY is missing. Mocking email delivery.");
    console.warn("📧  OTP for %s is: %s", email, otp);
    return { success: true, mocked: true };
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

export async function sendBookingConfirmation(email: string, details: { serviceName: string; price: string; date?: string }) {
  if (!brevo) {
    console.warn("⚠️  BREVO_API_KEY missing. Mocking booking confirmation.");
    return { success: true, mocked: true };
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
