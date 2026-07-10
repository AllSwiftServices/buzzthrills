import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    // 1. Verify current password against the real credential store (auth_accounts).
    // The previous implementation checked Supabase's legacy auth.users via
    // signInWithPassword, but this app's real credentials live in
    // auth_accounts.password_hash (bcrypt) — that store was never touched by
    // password changes made here, so this always failed for custom-auth users
    // and silently no-op'd their real login password even when it "succeeded".
    const { data: account, error: accountError } = await supabaseAdmin
      .from("auth_accounts")
      .select("id, password_hash")
      .eq("id", payload.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const isMatched = await bcrypt.compare(currentPassword, account.password_hash);
    if (!isMatched) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    // 2. Update to new password
    const newHash = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabaseAdmin
      .from("auth_accounts")
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq("id", account.id);

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
