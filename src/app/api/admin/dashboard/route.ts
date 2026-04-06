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
      throw new Error("Administrative Client Mission Failure");
    }

    // 1. Fetch Analytics View
    const { data: analytics, error: analyticsError } = await supabaseAdmin
      .from("analytics_summary")
      .select("*")
      .single();

    if (analyticsError) console.error("Analytics Fetch Failure:", analyticsError);

    // 2. Fetch Recent Missions (Calls)
    const { data: calls, error: callsError } = await supabaseAdmin
      .from("calls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (callsError) console.error("Calls Fetch Failure:", callsError);

    // 3. Pending Mission Count
    const { count: pendingCount, error: pendingError } = await supabaseAdmin
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (pendingError) console.error("Pending Count Failure:", pendingError);

    return NextResponse.json({
      analytics: analytics || {},
      calls: calls || [],
      pendingCount: pendingCount || 0,
    });
  } catch (error) {
    console.error("Dashboard Intelligence Failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
