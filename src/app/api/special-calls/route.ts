import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Public endpoint — no auth required
export async function GET() {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    const { data, error } = await supabaseAdmin
      .from("special_calls")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ specialCall: data || null });
  } catch (error: any) {
    console.error("Special calls fetch error:", error);
    return NextResponse.json({ specialCall: null });
  }
}
