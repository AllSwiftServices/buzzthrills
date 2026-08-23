import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Only callers actually deliver calls, so the assignment dropdown offers callers
// only — admins can still be set as assigned_to directly via the DB/API if ever
// needed, this just keeps the UI list focused on who calls actually get worked by.
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

    const { data: staff, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role")
      .eq("role", "caller")
      .order("full_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ staff: staff || [] });
  } catch (error: any) {
    console.error("Admin staff fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
