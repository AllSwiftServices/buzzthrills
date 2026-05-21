import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { LETTER_MEDIA_LIMITS } from "@/lib/letters";

type Kind = "music" | "voice" | "video" | "photo";

function acceptedFor(kind: Kind): readonly string[] {
  if (kind === "music") return LETTER_MEDIA_LIMITS.acceptedMusic;
  if (kind === "voice") return LETTER_MEDIA_LIMITS.acceptedVoice;
  if (kind === "video") return LETTER_MEDIA_LIMITS.acceptedVideo;
  return LETTER_MEDIA_LIMITS.acceptedPhoto;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const kind = (formData.get("kind") as Kind | null) || "music";
    const letterId = (formData.get("letterId") as string | null) || "drafts";

    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
    if (!["music", "voice", "video", "photo"].includes(kind)) {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    if (file.size > LETTER_MEDIA_LIMITS.maxFileBytes) {
      return NextResponse.json(
        { error: `File too large (max ${LETTER_MEDIA_LIMITS.maxFileBytes / (1024 * 1024)}MB)` },
        { status: 413 }
      );
    }

    const accepted = acceptedFor(kind);
    if (file.type && !accepted.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type for ${kind}: ${file.type}` },
        { status: 415 }
      );
    }

    const fileExt = file.name.split(".").pop() || "bin";
    const fileName = `letters/${letterId}/${kind}-${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("recordings")
      .upload(fileName, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("recordings").getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl, kind });
  } catch (err: any) {
    console.error("Letter upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
