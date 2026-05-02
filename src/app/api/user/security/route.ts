import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

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

    // 1. Verify current password by attempting a sign-in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: currentPassword,
    });

    if (signInError || !signInData.user) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    // 2. Update to new password
    // Note: We use the session-less client if possible, but here we can just use the auth instance
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Security update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
