import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signAccessToken, setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
       throw new Error("Admin client initialization failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    // 1. Verify OTP
    const { data: otp, error: otpError } = await supabaseAdmin
      .from("auth_otps")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (otpError || !otp) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    // 2. Mark Account as Verified & Create Profile
    const { data: account, error: accountError } = await supabaseAdmin
      .from("auth_accounts")
      .update({ is_verified: true })
      .eq("email", email)
      .select()
      .single();

    if (accountError) throw accountError;

    // Create or Link Profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: account.id, // Using the new custom account ID
        full_name: account.full_name,
        email: email,
        role: account.role,
        account_id: account.id
      }, { onConflict: 'email' });

    if (profileError) throw profileError;

    // 3. Clear OTP
    await supabaseAdmin.from("auth_otps").delete().eq("email", email);

    // 4. Issue Tokens
    const accessToken = await signAccessToken({
      id: account.id,
      email: account.email,
      role: account.role,
    });

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Store Refresh Token in DB
    const { error: sessionError } = await supabaseAdmin
      .from("auth_sessions")
      .insert({
        user_id: account.id,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        user_agent: req.headers.get("user-agent"),
      });

    if (sessionError) throw sessionError;

    // 5. Build Response
    const response = NextResponse.json({
      message: "Verified successfully!",
      user: {
        id: account.id,
        email: account.email,
        fullName: account.full_name,
        role: account.role,
      },
      accessToken,
    });

    // Set Tokens as Cookies
    setAccessTokenCookie(response, accessToken);
    setRefreshTokenCookie(response, refreshToken);

    return response;

  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Failed to verify account" }, { status: 500 });
  }
}
