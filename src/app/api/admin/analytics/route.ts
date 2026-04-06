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
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    // Fetch analytics summary view
    const { data: analytics } = await supabaseAdmin
      .from("analytics_summary")
      .select("*")
      .single();

    // Also fetch live aggregate counts as fallback
    const { count: totalUsers } = await supabaseAdmin
      .from("auth_accounts")
      .select("*", { count: "exact", head: true });

    const { count: totalCalls } = await supabaseAdmin
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("status", "delivered");

    const { count: pendingCalls } = await supabaseAdmin
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: activeSubs } = await supabaseAdmin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    return NextResponse.json({
      analytics: analytics || null,
      totalUsers: totalUsers || 0,
      totalCalls: totalCalls || 0,
      pendingCalls: pendingCalls || 0,
      activeSubs: activeSubs || 0,
    });
  } catch (error: any) {
    console.error("Admin analytics fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
