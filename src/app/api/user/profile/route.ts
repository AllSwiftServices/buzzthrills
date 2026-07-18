import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
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

    if (!supabaseAdmin) {
      throw new Error("Admin Client initialization failure");
    }

    // 1. Fetch User's Recent Engagements
    const { data: calls, error: callsError } = await supabaseAdmin
      .from("calls")
      .select("*")
      .eq("user_id", payload.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (callsError) console.error("Calls Fetch Failure:", callsError);

    // 1b. Fetch User's Digital Letters
    const { data: letters, error: lettersError } = await supabaseAdmin
      .from("digital_letters")
      .select("id, recipient_name, theme, status, qr_identifier, unfurled_count, wants_scannable, scannable_status, created_at")
      .eq("sender_id", payload.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (lettersError) console.error("Letters Fetch Failure:", lettersError);

    // 2. Fetch User's Active Subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", payload.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError && subError.code !== "PGRST116") {
      console.error("Subscription Fetch Failure:", subError);
    }

    // 3. Fetch Profile Info
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", payload.id)
      .single();

    if (profileError) console.error("Profile Fetch Failure:", profileError);

    return NextResponse.json({
      profile: profile || null,
      history: calls || [],
      letters: letters || [],
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Profile data fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
    const { fullName, phone } = body;

    if (!supabaseAdmin) {
      throw new Error("Admin Client initialization failure");
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // full_name is kept in sync with auth_accounts by a DB trigger (see
    // src/db/migrations/0002_sync_profiles_auth_accounts_fields.sql) — no
    // need to write auth_accounts here too.

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
