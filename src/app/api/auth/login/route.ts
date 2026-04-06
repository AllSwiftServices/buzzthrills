import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { signAccessToken, setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
       throw new Error("Administrative Client Mission Failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    // 1. Find Account
    const { data: account, error: accountError } = await supabaseAdmin
      .from("auth_accounts")
      .select("*")
      .eq("email", email)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Check Verification
    if (!account.is_verified) {
      return NextResponse.json({ error: "Please verify your email first", unverified: true }, { status: 403 });
    }

    // 3. Verify Password
    const isMatched = await bcrypt.compare(password, account.password_hash);
    if (!isMatched) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Issue Tokens (Skip OTP on login as per user request)
    const accessToken = await signAccessToken({
      id: account.id,
      email: account.email,
      role: account.role,
    });

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
      message: "Login successful!",
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
