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
    if (!payload || payload.role !== "caller") {
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

    // A caller may only upload a recording for a call actually assigned to them.
    const { data: call, error: fetchError } = await supabaseAdmin
      .from("calls")
      .select("id")
      .eq("id", callId)
      .eq("assigned_to", payload.id)
      .single();

    if (fetchError || !call) {
      return NextResponse.json({ error: "Call not found or not assigned to you" }, { status: 404 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${callId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('recordings')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('recordings')
      .getPublicUrl(fileName);

    return NextResponse.json({
      message: "File uploaded successfully",
      recordingUrl: publicUrl
    });

  } catch (error: any) {
    console.error("Caller call upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
