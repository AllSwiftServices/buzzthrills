import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendResetOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
       throw new Error("Admin client initialization failure");
    }

    // 1. Check if user exists in auth_accounts
    const { data: user, error: userError } = await supabaseAdmin
      .from("auth_accounts")
      .select("email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      // For security reasons, don't reveal if the user exists or not
      // Just return success even if not found to prevent email enumeration
      return NextResponse.json({ message: "If that email is registered, you'll receive a code shortly! ✨" });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Delete old OTPs for this email to avoid confusion
    await supabaseAdmin.from("auth_otps").delete().eq("email", email);

    // 4. Store new OTP
    const { error: otpError } = await supabaseAdmin
      .from("auth_otps")
      .insert({ email, code: otp, expires_at: expiresAt });

    if (otpError) throw otpError;

    // 5. Send Reset Email
    console.log(`[AUTH_DEBUG] Sending reset email to ${email} with OTP ${otp}`);
    const result = await sendResetOTPEmail(email, otp);
    console.log(`[AUTH_DEBUG] Send email result:`, result);

    return NextResponse.json({ message: "Magic code sent! Check your inbox. 📬" });

  } catch (error: any) {
    console.error("[AUTH_ERROR] Forgot password error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
