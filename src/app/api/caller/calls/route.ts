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
    if (!payload || payload.role !== "caller") {
      return NextResponse.json({ error: "Forbidden: Caller access required" }, { status: 403 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    // Only calls assigned to this caller — never the full calls table.
    const { data: calls, error } = await supabaseAdmin
      .from("calls")
      .select("*, profiles!user_id(full_name, email)")
      .eq("assigned_to", payload.id)
      .order("occasion_date", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ calls: calls || [] });
  } catch (error: any) {
    console.error("Caller calls fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
