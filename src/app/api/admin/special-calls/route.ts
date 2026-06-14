import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

// GET — list all special calls
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!supabaseAdmin) throw new Error("Admin client initialization failure");

    const { data, error } = await supabaseAdmin
      .from("special_calls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ specialCalls: data || [] });
  } catch (error: any) {
    console.error("Admin special calls GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — create a new special call
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!supabaseAdmin) throw new Error("Admin client initialization failure");

    const body = await req.json();
    const { title, description, occasion_emoji, price, currency, active, call_date } = body;

    if (!title || price == null) {
      return NextResponse.json({ error: "title and price are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("special_calls")
      .insert({
        title,
        description: description || "",
        occasion_emoji: occasion_emoji || "🎉",
        price: Number(price),
        currency: currency || "NGN",
        active: active ?? false,
        call_date: call_date || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ specialCall: data }, { status: 201 });
  } catch (error: any) {
    console.error("Admin special calls POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
