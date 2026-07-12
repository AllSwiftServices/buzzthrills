import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Staff = anyone who can be assigned a call: admins and callers.
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
      .in("role", ["admin", "caller"])
      .order("full_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ staff: staff || [] });
  } catch (error: any) {
    console.error("Admin staff fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
