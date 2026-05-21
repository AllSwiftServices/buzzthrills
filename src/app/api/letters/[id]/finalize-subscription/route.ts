import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    if (!supabaseAdmin) throw new Error("Admin client init failure");

    const { data: letter, error: letterErr } = await supabaseAdmin
      .from("digital_letters")
      .select("*")
      .eq("id", id)
      .single();
    if (letterErr || !letter) return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    if (letter.sender_id !== payload.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (letter.status === "published") return NextResponse.json({ success: true, letter });

    const { data: subscription, error: subErr } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", payload.id)
      .eq("status", "active")
      .single();

    if (subErr || !subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 403 });
    }
    if (subscription.next_billing_date && new Date(subscription.next_billing_date) < new Date()) {
      return NextResponse.json({ error: "Subscription expired" }, { status: 403 });
    }
    const remaining = (subscription.total_calls ?? 0) - (subscription.calls_made ?? 0);
    if (remaining < 1) {
      return NextResponse.json({ error: "Quota exceeded", remaining }, { status: 402 });
    }

    await supabaseAdmin
      .from("digital_letters")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", id);

    await supabaseAdmin
      .from("subscriptions")
      .update({ calls_made: (subscription.calls_made || 0) + 1 })
      .eq("id", subscription.id);

    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", payload.id)
        .single();
      if (profile?.email) {
        const { sendLetterReadyEmail } = await import("@/lib/email");
        const origin = new URL(_request.url).origin;
        await sendLetterReadyEmail(profile.email, {
          recipientName: letter.recipient_name,
          shareUrl: `${origin}/letter/${letter.qr_identifier}`,
        });
      }
    } catch (e) {
      console.error("Letter ready email failed:", e);
    }

    return NextResponse.json({ success: true, remaining: remaining - 1 });
  } catch (err: any) {
    console.error("Letter finalize-subscription error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
