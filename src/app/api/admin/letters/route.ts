import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const { data: letters, error } = await supabaseAdmin
      .from("digital_letters")
      .select(
        "id, sender_id, recipient_name, recipient_phone, theme, tier, status, qr_identifier, unfurled_count, created_by_admin, created_at, updated_at, wants_scannable, scannable_status, request_admin_letter, request_admin_voice"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    const senderIds = Array.from(new Set((letters || []).map((l) => l.sender_id).filter(Boolean)));
    const { data: profiles } = senderIds.length
      ? await supabaseAdmin.from("profiles").select("id, email, full_name").in("id", senderIds)
      : { data: [] as any[] };

    const senderMap = new Map((profiles || []).map((p) => [p.id, p]));
    const enriched = (letters || []).map((l) => ({
      ...l,
      sender_email: l.sender_id ? senderMap.get(l.sender_id)?.email || null : null,
      sender_name: l.sender_id ? senderMap.get(l.sender_id)?.full_name || null : null,
    }));

    return NextResponse.json({ letters: enriched });
  } catch (err: any) {
    console.error("Admin letters list error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
