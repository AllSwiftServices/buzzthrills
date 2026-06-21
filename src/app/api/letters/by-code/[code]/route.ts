import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const { data: letter, error } = await supabaseAdmin
      .from("digital_letters")
      .select(
        "id, recipient_name, message, theme, tier, background_music_url, voice_note_url, video_url, qr_identifier, unfurled_count, status, created_at, sender_id, recipient_photo_url, recipient_email"
      )
      .eq("qr_identifier", code)
      .single();

    if (error || !letter || letter.status !== "published") {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    let senderName: string | null = null;
    if (letter.sender_id) {
      const { data: sender } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("id", letter.sender_id)
        .single();
      if (sender?.full_name) {
        senderName = sender.full_name.split(" ")[0];
      }
    }

    await supabaseAdmin
      .from("digital_letters")
      .update({ unfurled_count: (letter.unfurled_count ?? 0) + 1 })
      .eq("id", letter.id);

    const { sender_id: _drop, ...publicLetter } = letter;

    return NextResponse.json({ letter: { ...publicLetter, sender_first_name: senderName } });
  } catch (err: any) {
    console.error("Letter by-code error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
