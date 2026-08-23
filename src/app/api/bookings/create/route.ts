import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin Client initialization failure");
    }

    const { recipients, service, variant, isExpress, isInternational, preferredCallerId, metadata } = await request.json();

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "At least one recipient is required" }, { status: 400 });
    }

    // 1. Verify User's Active Subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", payload.id)
      .eq("status", "active")
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 403 });
    }

    // 2. Expiry check — a stale active row shouldn't grant calls.
    if (subscription.next_billing_date && new Date(subscription.next_billing_date) < new Date()) {
      return NextResponse.json(
        { error: "Subscription has expired. Renew to continue booking." },
        { status: 403 }
      );
    }

    // 3. Quota check
    const requested = recipients.length;
    const remaining = (subscription.total_calls ?? 0) - (subscription.calls_made ?? 0);
    if (requested > remaining) {
      return NextResponse.json(
        { error: "Quota exceeded for this billing cycle", remaining, requested },
        { status: 402 }
      );
    }

    // 4. "Choose your preferred caller" is an Orbit-only perk — re-check plan and
    // caller identity server-side rather than trusting the client's request body.
    let assignedTo: string | null = null;
    if (preferredCallerId && subscription.plan === "orbit") {
      const { data: caller } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("id", preferredCallerId)
        .eq("role", "caller")
        .single();
      if (caller) assignedTo = caller.id;
    }

    // 5. Create Call Records
    const bookingMetadata = metadata && typeof metadata === "object" ? metadata : {};
    const callEntries = recipients.map((r: any, idx: number) => ({
      user_id: payload.id,
      assigned_to: assignedTo,
      recipient_name: r.name,
      recipient_phone: r.phone,
      relationship: r.relationship || null,
      occasion_type: r.occasion || service || "General",
      occasion_date: r.date,
      call_type: variant || "standard",
      scheduled_slot: r.time || "morning",
      is_express: !!isExpress,
      is_international: !!isInternational,
      status: "pending",
      metadata: {
        ...bookingMetadata,
        recipient: bookingMetadata?.recipients?.[idx] ?? null,
      },
    }));

    const { error: insertError } = await supabaseAdmin
      .from("calls")
      .insert(callEntries);

    if (insertError) throw insertError;

    // 6. Deduct from quota
    await supabaseAdmin
      .from("subscriptions")
      .update({ calls_made: (subscription.calls_made || 0) + callEntries.length })
      .eq("id", subscription.id);

    // 7. Send confirmation + admin notification
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", payload.id)
        .single();

      const { sendBookingConfirmation, sendAdminCallNotification } = await import("@/lib/email");
      const { getPlan } = await import("@/lib/plans");
      const planName = getPlan(subscription.plan)?.name || "Buzzthrills Subscription";

      if (profile?.email) {
        await sendBookingConfirmation(profile.email, {
          serviceName: `${planName} · ${callEntries.length} call${callEntries.length === 1 ? "" : "s"}`,
          price: "0",
          isSubscription: true,
        });
      }

      await sendAdminCallNotification(callEntries.map((c) => ({
        recipient_name: c.recipient_name,
        recipient_phone: c.recipient_phone,
        occasion_type: c.occasion_type,
        occasion_date: c.occasion_date,
        call_type: c.call_type,
        scheduled_slot: c.scheduled_slot,
      })));
    } catch (emailError) {
      console.error("Subscriber booking email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      booked: callEntries.length,
      remaining: remaining - requested,
    });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
