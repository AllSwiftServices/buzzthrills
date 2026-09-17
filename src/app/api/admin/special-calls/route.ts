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
  } catch (error: unknown) {
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
    const { title, description, occasion_emoji, image_url, price, currency, price_options, custom_questions, active, call_date } = body;

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const sanitizedPriceOptions = Array.isArray(price_options)
      ? (price_options as Array<{ title?: unknown; price?: unknown }>)
          .filter((opt) => opt && opt.title && opt.price != null && !isNaN(Number(opt.price)))
          .map((opt) => ({
            title: String(opt.title).trim(),
            price: Number(opt.price),
          }))
      : [];

    const sanitizedQuestions = Array.isArray(custom_questions)
      ? (custom_questions as unknown[])
          .map((q) => (typeof q === "string" ? q.trim() : ""))
          .filter((q) => q.length > 0)
      : [];

    const effectivePrice = price != null ? Number(price) : (sanitizedPriceOptions[0]?.price ?? 0);

    const { data, error } = await supabaseAdmin
      .from("special_calls")
      .insert({
        title,
        description: description || "",
        occasion_emoji: occasion_emoji || "🎉",
        image_url: image_url || null,
        price: effectivePrice,
        currency: currency || "NGN",
        price_options: sanitizedPriceOptions,
        custom_questions: sanitizedQuestions,
        active: active ?? false,
        call_date: call_date || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ specialCall: data }, { status: 201 });
  } catch (error: unknown) {
    console.error("Admin special calls POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
