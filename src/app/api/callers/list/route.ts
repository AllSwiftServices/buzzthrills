import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

// Any signed-in user can see caller names — needed for the "choose your preferred
// caller" booking option (Orbit plan). No sensitive fields, just id + name.
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const { data: callers, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .eq("role", "caller")
      .order("full_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ callers: callers || [] });
  } catch (error: any) {
    console.error("Callers list error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
