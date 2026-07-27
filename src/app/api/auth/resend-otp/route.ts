import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, purpose } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    if (!supabaseAdmin) {
       throw new Error("Administrative Client Mission Failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    // 1. Check if account exists
    const { data: account, error: accountError } = await supabaseAdmin
      .from("auth_accounts")
      .select("is_verified")
      .eq("email", email)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Being verified is the normal case for a forgot-password resend, so only
    // block resends for the signup flow, where an already-verified account
    // has nothing left to verify.
    if (account.is_verified && purpose !== 'forgot') {
      return NextResponse.json({ error: "Account already verified" }, { status: 400 });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Replace any existing OTP row(s) for this email with the new one
    await supabaseAdmin.from("auth_otps").delete().eq("email", email);
    const { error: otpError } = await supabaseAdmin
      .from("auth_otps")
      .insert({ email, code: otp, expires_at: expiresAt });

    if (otpError) throw otpError;

    // 4. Send OTP via Email
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: "New verification code sent!" });

  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend code" }, { status: 500 });
  }
}
