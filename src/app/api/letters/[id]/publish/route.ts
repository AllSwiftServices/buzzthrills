import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const caller = await verifyToken(token);
    if (!caller || caller.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!supabaseAdmin) throw new Error("Admin client init failure");

    // Fetch the letter + sender email
    const { data: letter, error: fetchErr } = await supabaseAdmin
      .from("digital_letters")
      .select("id, qr_identifier, recipient_name, status, sender_id")
      .eq("id", id)
      .single();

    if (fetchErr || !letter) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    if (letter.status === "published") {
      return NextResponse.json({ error: "Already published" }, { status: 400 });
    }

    // Publish the letter
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("digital_letters")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, qr_identifier, recipient_name")
      .single();

    if (updateErr) throw updateErr;

    // Get sender profile to notify them
    const { data: senderProfile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", letter.sender_id)
      .single();

    if (senderProfile?.email) {
      try {
        const { sendLetterReadyEmail } = await import("@/lib/email");
        const origin = new URL(request.url).origin;
        await sendLetterReadyEmail(senderProfile.email, {
          recipientName: updated?.recipient_name || "your recipient",
          shareUrl: `${origin}/letter/${updated?.qr_identifier}`,
        });
      } catch (e) {
        console.error("Letter ready email failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      letter: updated,
      shareUrl: `${new URL(request.url).origin}/letter/${updated?.qr_identifier}`,
    });
  } catch (err: any) {
    console.error("Letter publish error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
