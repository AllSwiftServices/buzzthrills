import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { getLetterTier, getThemeSpec } from "@/lib/letters";

async function getCallerWithRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caller = await getCallerWithRole();
    if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const { data: letter, error } = await supabaseAdmin
      .from("digital_letters")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !letter) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (letter.sender_id !== caller.id && caller.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ letter });
  } catch (err: any) {
    console.error("Letter GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caller = await getCallerWithRole();
    if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("digital_letters")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isAdmin = caller.role === "admin";
    const isOwnerDraft = existing.sender_id === caller.id && existing.status === "draft";
    if (!isAdmin && !isOwnerDraft) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const patch: Record<string, any> = {};
    const writable = [
      "recipient_name",
      "recipient_phone",
      "recipient_email",
      "recipient_photo_url",
      "message",
      "background_music_url",
      "voice_note_url",
      "video_url",
      "additional_comments",
    ];
    for (const key of writable) {
      if (key in body) patch[key] = body[key];
    }
    if ("request_admin_voice" in body) patch.request_admin_voice = !!body.request_admin_voice;
    if ("request_admin_letter" in body) patch.request_admin_letter = !!body.request_admin_letter;
    if ("theme" in body) patch.theme = getThemeSpec(body.theme).id;
    if ("tier" in body) patch.tier = getLetterTier(body.tier);
    if ("wants_scannable" in body) {
      patch.wants_scannable = !!body.wants_scannable;
      // Keep status in sync — flip to "pending" when enabled, "none" when disabled
      if (existing.scannable_status === "none" && body.wants_scannable) {
        patch.scannable_status = "pending";
      } else if (existing.scannable_status === "pending" && !body.wants_scannable) {
        patch.scannable_status = "none";
      }
    }
    if (isAdmin) {
      if ("admin_notes" in body) patch.admin_notes = body.admin_notes;
      if ("status" in body && ["draft", "processing", "published", "archived"].includes(body.status)) {
        patch.status = body.status;
      }
      if ("scannable_status" in body && ["none", "pending", "printed", "shipped"].includes(body.scannable_status)) {
        patch.scannable_status = body.scannable_status;
      }
    }

    patch.updated_at = new Date().toISOString();

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("digital_letters")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({ letter: updated });
  } catch (err: any) {
    console.error("Letter PATCH error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
