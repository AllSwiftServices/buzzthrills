import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Public: upcoming days that are closed for bookings.
export async function GET() {
  try {
    if (!supabaseAdmin) throw new Error("Admin client initialization failure");
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
    const { data, error } = await supabaseAdmin
      .from("blocked_dates")
      .select("blocked_date, reason")
      .gte("blocked_date", today)
      .order("blocked_date", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ blocked: data || [] });
  } catch (error) {
    console.error("Blocked dates fetch error:", error);
    return NextResponse.json({ blocked: [] });
  }
}
