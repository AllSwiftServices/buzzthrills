import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { generateLetterCode, getLetterTier, getThemeSpec } from "@/lib/letters";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const body = await request.json();
    const {
      recipient_name,
      recipient_phone,
      recipient_photo_url,
      message,
      theme,
      tier,
      background_music_url,
      voice_note_url,
      video_url,
      wants_scannable,
      additional_comments,
      request_admin_voice,
      request_admin_letter,
    } = body || {};

    if (!recipient_name || !message) {
      return NextResponse.json({ error: "Recipient and message are required" }, { status: 400 });
    }

    const themeSpec = getThemeSpec(theme);
    const tierValue = getLetterTier(tier);

    let code = generateLetterCode();
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: clash } = await supabaseAdmin
        .from("digital_letters")
        .select("id")
        .eq("qr_identifier", code)
        .maybeSingle();
      if (!clash) break;
      code = generateLetterCode();
    }

    const { data, error } = await supabaseAdmin
      .from("digital_letters")
      .insert({
        sender_id: payload.id,
        recipient_name,
        recipient_phone: recipient_phone || null,
        recipient_photo_url: recipient_photo_url || null,
        message,
        theme: themeSpec.id,
        tier: tierValue,
        background_music_url: background_music_url || null,
        voice_note_url: voice_note_url || null,
        video_url: video_url || null,
        wants_scannable: !!wants_scannable,
        scannable_status: wants_scannable ? "pending" : "none",
        additional_comments: additional_comments || null,
        request_admin_voice: !!request_admin_voice,
        request_admin_letter: !!request_admin_letter,
        qr_identifier: code,
        status: "draft",
      })
      .select("id, qr_identifier, tier, theme")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, letter: data });
  } catch (err: any) {
    console.error("Letter create error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
