import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files (JPEG, PNG, WebP, etc.) are allowed" }, { status: 400 });
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image file exceeds 10MB limit" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `special-calls/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("recordings")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("recordings").getPublicUrl(fileName);

    return NextResponse.json({
      message: "Flyer uploaded successfully",
      url: publicUrl,
    });
  } catch (error: unknown) {
    console.error("Admin special call image upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
