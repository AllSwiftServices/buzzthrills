import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Audio MIME / extension validation
    const isAudioType =
      file.type.startsWith("audio/") ||
      file.type === "video/mp4" || // Some Safari recordings report audio as video/mp4
      /\.(mp3|wav|m4a|aac|ogg|webm|flac|caf)$/i.test(file.name);

    if (!isAudioType) {
      return NextResponse.json(
        { error: "Please upload a valid audio file (MP3, WAV, M4A, AAC, OGG)." },
        { status: 400 }
      );
    }

    // Max 25MB
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Audio file is too large (max 25MB)." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      throw new Error("Supabase admin client not initialized");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "mp3";
    const fileName = `client-voice-notes/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("recordings")
      .upload(fileName, file, {
        contentType: file.type || "audio/mpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("recordings").getPublicUrl(fileName);

    return NextResponse.json({
      message: "Audio uploaded successfully",
      url: publicUrl,
    });
  } catch (error: unknown) {
    console.error("Booking audio upload error:", error);
    const message = error instanceof Error ? error.message : "Audio upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
