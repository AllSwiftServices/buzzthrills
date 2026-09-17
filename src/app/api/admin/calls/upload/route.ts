import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const callId = formData.get("callId") as string | null;

    if (!file || !callId) {
      return NextResponse.json({ error: "Missing audio file or call ID." }, { status: 400 });
    }

    // Max 50MB limit
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 50MB size limit." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    // Extract extension safely (handle uppercase .MP3, dots in filename, or empty extensions)
    const rawExt = file.name ? file.name.split(".").pop()?.toLowerCase() || "" : "";
    const knownExts = ["mp3", "m4a", "wav", "aac", "ogg", "opus", "webm", "flac", "caf", "mp4"];
    const fileExt = knownExts.includes(rawExt) ? rawExt : "mp3";

    // Deduce robust MIME content type for Supabase (especially for iOS Safari and Android)
    let contentType = file.type;
    if (!contentType || contentType === "application/octet-stream" || contentType === "binary/octet-stream") {
      if (fileExt === "mp3") contentType = "audio/mpeg";
      else if (fileExt === "m4a" || fileExt === "mp4") contentType = "audio/mp4";
      else if (fileExt === "wav") contentType = "audio/wav";
      else if (fileExt === "aac") contentType = "audio/aac";
      else if (fileExt === "ogg") contentType = "audio/ogg";
      else if (fileExt === "opus") contentType = "audio/opus";
      else if (fileExt === "webm") contentType = "audio/webm";
      else if (fileExt === "flac") contentType = "audio/flac";
      else if (fileExt === "caf") contentType = "audio/x-caf";
      else contentType = "audio/mpeg";
    }

    // Convert to Node Buffer for 100% reliable Supabase storage upload in Next.js Server
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${callId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("recordings")
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase admin storage upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message || "Failed to upload recording to storage" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("recordings")
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      recordingUrl: publicUrl 
    });

  } catch (error: any) {
    console.error("Admin call upload error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
