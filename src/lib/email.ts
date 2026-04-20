import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465");

// Robust SMTP initialization (Aventridge Pattern)
const transporter = smtpUser && smtpPass ? nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
}) : null;

export async function sendOTPEmail(email: string, otp: string) {
  if (!transporter) {
    console.warn("⚠️  SMTP configuration is missing. Mocking email delivery.");
    console.warn("📧  OTP for %s is: %s", email, otp);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"BuzzThrills Support" <${smtpUser}>`,
      to: email,
      subject: "Your BuzzThrills Activation Code 🎁",
      html: `
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

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("SMTP delivery failed:", error);
    // Even if SMTP fails, we've already logged the OTP in dev console if mocked
    throw error;
  }
}
