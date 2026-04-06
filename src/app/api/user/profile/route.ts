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

    // 2. Fetch User's Active Subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", payload.id)
      .eq("status", "active")
      .single();

    if (subError && subError.code !== "PGRST116") {
      console.error("Subscription Fetch Failure:", subError);
    }

    return NextResponse.json({
      history: calls || [],
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Profile data fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
