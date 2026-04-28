import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
       throw new Error("Admin client initialization failure");
    }

    // 1. Verify OTP
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from("auth_otps")
      .select("*")
      .eq("email", email)
      .eq("code", otp)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: "Invalid or expired magic code ❌" }, { status: 401 });
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password in auth_accounts
    const { error: updateError } = await supabaseAdmin
      .from("auth_accounts")
      .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
      .eq("email", email);

    if (updateError) throw updateError;

    // 4. Delete the used OTP
    await supabaseAdmin.from("auth_otps").delete().eq("email", email);

    return NextResponse.json({ message: "Password reset successful! 🚀" });

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
