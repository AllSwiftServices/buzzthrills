import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }
  if (!supabaseAdmin) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  return null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { data, error } = await supabaseAdmin!
    .from("blocked_dates")
    .select("id, blocked_date, reason, created_at")
    .order("blocked_date", { ascending: true });
  if (error) return NextResponse.json({ error: "Failed to load blocked dates" }, { status: 500 });
  return NextResponse.json({ blocked: data || [] });
}

// Body: { dates: string[] (YYYY-MM-DD), reason?: string }
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const dates: string[] = Array.isArray(body.dates) ? body.dates : body.date ? [body.date] : [];
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 120) || null : null;
  if (dates.length === 0 || dates.length > 366 || !dates.every((d) => typeof d === "string" && DATE_RE.test(d))) {
    return NextResponse.json({ error: "Provide valid dates (YYYY-MM-DD)." }, { status: 400 });
  }
  const rows = [...new Set(dates)].map((d) => ({ blocked_date: d, reason }));
  const { error } = await supabaseAdmin!.from("blocked_dates").upsert(rows, { onConflict: "blocked_date" });
  if (error) return NextResponse.json({ error: "Failed to save blocked dates" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { error } = await supabaseAdmin!.from("blocked_dates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  return NextResponse.json({ success: true });
}
