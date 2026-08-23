import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { LETTER_MEDIA_LIMITS, isAcceptedLetterMedia, type LetterMediaKind } from "@/lib/letters";

type Kind = LetterMediaKind;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });

    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const body = await req.json();
    const { filename, filetype, filesize, kind, letterId } = body;

    const selectedKind = (kind as Kind | null) || "music";
    const selectedLetterId = letterId || "drafts";

    if (!filename || !filetype || filesize === undefined) {
      return NextResponse.json({ error: "Missing metadata parameters" }, { status: 400 });
    }

    if (!["music", "voice", "video", "photo"].includes(selectedKind)) {
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }

    if (filesize > LETTER_MEDIA_LIMITS.maxFileBytes) {
      return NextResponse.json(
        { error: `File too large (max ${LETTER_MEDIA_LIMITS.maxFileBytes / (1024 * 1024)}MB)` },
        { status: 413 }
      );
    }

    if (!isAcceptedLetterMedia(selectedKind, filetype)) {
      return NextResponse.json(
        { error: `Unsupported file type for ${selectedKind}: ${filetype}` },
        { status: 415 }
      );
    }

    const fileExt = filename.split(".").pop() || "bin";
    const fileName = `letters/${selectedLetterId}/${selectedKind}-${uuidv4()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("recordings")
      .createSignedUploadUrl(fileName);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("recordings").getPublicUrl(fileName);

    return NextResponse.json({
      signedUrl: uploadData.signedUrl,
      url: publicUrl,
      kind: selectedKind,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    });
  } catch (err: any) {
    console.error("Letter upload URL generation error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate upload URL" }, { status: 500 });
  }
}
