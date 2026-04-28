import { readFileSync } from 'fs';
import { BrevoClient } from '@getbrevo/brevo';

// Simple .env.local parser
const env = readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      acc[key.trim()] = valueParts.join('=').trim();
    }
    return acc;
  }, {});

const BREVO_API_KEY = env.BREVO_API_KEY;
const SENDER_EMAIL = env.BREVO_SENDER_EMAIL || "hello@buzzthrillsprime.com";
const SENDER_NAME = "BuzzThrills Test";

if (!BREVO_API_KEY) {
  console.error("BREVO_API_KEY is missing in .env.local");
  process.exit(1);
}

const brevo = new BrevoClient({ apiKey: BREVO_API_KEY });

async function testEmail() {
  try {
    console.log("Sending test email to danielbarima235@gmail.com...");
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: "BuzzThrills Test Email 🚀",
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: "danielbarima235@gmail.com" }],
      htmlContent: `
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #8b5cf6;">Email System Test Success! ✅</h1>
          <p>This is a test email from the BuzzThrills development environment.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
          <div style="margin-top: 20px; color: #666; font-size: 12px;">
            BuzzThrills Development Script
          </div>
        </div>
      `,
    });
    console.log("Email sent successfully!");
    console.log("Message ID:", data.messageId);
  } catch (error) {
    console.error("Failed to send email:", error.response?.body || error.message);
  }
}

testEmail();
