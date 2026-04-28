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
    const file = formData.get("file") as File;
    const callId = formData.get("callId") as string;

    if (!file || !callId) {
      return NextResponse.json({ error: "Missing file or callId" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    // 1. Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${callId}/${uuidv4()}.${fileExt}`;
    const filePath = `recordings/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('recordings')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL (or signed URL if bucket is private)
    // For now, let's assume we want a public URL if the bucket is public, 
    // or we'll store the path and use a getter.
    // In this project, let's use public URLs for simplicity if the bucket allows.
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('recordings')
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      recordingUrl: publicUrl 
    });

  } catch (error: any) {
    console.error("Admin call upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
