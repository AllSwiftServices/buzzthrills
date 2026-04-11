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

    // 1. Fetch Analytics View (Fallback/Existing)
    const { data: analytics, error: analyticsError } = await supabaseAdmin
      .from("analytics_summary")
      .select("*")
      .single();

    if (analyticsError) console.error("Analytics Fetch Failure:", analyticsError);

    // 2. Fetch Real-time Client Count
    const { count: totalUsers } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // 3. Fetch Geographic Distribution
    const { data: locations, error: geoError } = await supabaseAdmin
      .from("profiles")
      .select("location");
    
    // Process locations into a summary
    const locationCounts: Record<string, number> = {};
    (locations || []).forEach(p => {
      const loc = p.location || "Unknown Location";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const geoSummary = Object.entries(locationCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Top 4 locations

    // 4. Fetch Recent Engagements (Calls)
    const { data: calls, error: callsError } = await supabaseAdmin
      .from("calls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (callsError) console.error("Calls Fetch Failure:", callsError);

    // 5. Pending Engagement Count
    const { count: pendingCount, error: pendingError } = await supabaseAdmin
      .from("calls")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (pendingError) console.error("Pending Count Failure:", pendingError);

    return NextResponse.json({
      analytics: {
        ...analytics,
        total_users: totalUsers || 0,
        geoSummary
      },
      calls: calls || [],
      pendingCount: pendingCount || 0,
    });
  } catch (error) {
    console.error("Admin dashboard data fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
