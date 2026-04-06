import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
       throw new Error("Administrative Client Mission Failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    // 1. Check if user already exists
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Account (Unverified)
    const { data: account, error: accountError } = await supabaseAdmin
      .from("auth_accounts")
      .insert({
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        is_verified: false,
      })
      .select()
      .single();

    if (accountError) {
      if (accountError.code === "23505") { // Unique violation
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      throw accountError;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    const { error: otpError } = await supabaseAdmin
      .from("auth_otps")
      .insert({ email, code: otp, expires_at: expiresAt });

    if (otpError) throw otpError;

    // Send OTP via the robust Email Service
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: "Verification code sent!" });

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
