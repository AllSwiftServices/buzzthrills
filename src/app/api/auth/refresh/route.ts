import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signAccessToken, setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!supabaseAdmin) {
       throw new Error("Administrative Client Mission Failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    if (!refreshToken) {
      const res = NextResponse.json({ error: "No refresh token" }, { status: 401 });
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }

    // 1. Find Session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("auth_sessions")
      .select("*, auth_accounts(*)")
      .eq("refresh_token", refreshToken)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (sessionError || !session) {
       // Clear invalid cookies
       const res = NextResponse.json({ error: "Invalid session" }, { status: 401 });
       res.cookies.delete("access_token");
       res.cookies.delete("refresh_token");
       return res;
    }

    const account = session.auth_accounts;

    // 2. Issue New Tokens (Rotation)
    const newAccessToken = await signAccessToken({
      id: account.id,
      email: account.email,
      role: account.role,
    });

    const newRefreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // 3. Update Session in DB (Rotate Refresh Token)
    const { error: updateError } = await supabaseAdmin
      .from("auth_sessions")
      .update({
        refresh_token: newRefreshToken,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (updateError) throw updateError;

    // 4. Build Response
    const response = NextResponse.json({
      accessToken: newAccessToken,
      user: {
        id: account.id,
        email: account.email,
        fullName: account.full_name,
        role: account.role,
      },
    });

    // Set Tokens as Cookies
    setAccessTokenCookie(response, newAccessToken);
    setRefreshTokenCookie(response, newRefreshToken);

    return response;

  } catch (error: any) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Failed to refresh session" }, { status: 500 });
  }
}
