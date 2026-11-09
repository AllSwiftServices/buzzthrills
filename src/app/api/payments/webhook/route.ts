import { NextResponse } from "next/server";
import crypto from "crypto";
import { PAYSTACK_SECRET_KEY } from "@/lib/paystack";
import { getPlan } from "@/lib/plans";

// Paystack calls this for every charge, including automatic subscription
// renewals, which never pass through the checkout page. Without it the monthly
// call allowance is never reset and renewed customers get blocked.
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  const expected = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  // Only successful charges on a Paystack plan are renewal candidates.
  if (event.event !== "charge.success" || !event.data?.plan?.plan_code) {
    return NextResponse.json({ received: true });
  }

  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    if (!supabaseAdmin) throw new Error("Admin client unavailable");

    const email = String(event.data.customer?.email || "").toLowerCase();
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .ilike("email", email)
      .maybeSingle();
    if (!profile) return NextResponse.json({ received: true });

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle();
    if (!sub) return NextResponse.json({ received: true });

    // The first charge is handled by /api/payments/verify and leaves
    // next_billing_date ~30 days away. A real renewal arrives when that date
    // is due (Paystack's "1 month" can land a few days before our +30d), and
    // advancing the date below makes duplicate deliveries a no-op.
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
    const due = !sub.next_billing_date || new Date(sub.next_billing_date).getTime() - Date.now() <= THREE_DAYS;
    if (!due) return NextResponse.json({ received: true });

    const planConfig = getPlan(sub.plan);
    if (!planConfig || planConfig.isCustom) return NextResponse.json({ received: true });

    const cycle: "monthly" | "annual" = sub.billing_cycle === "annual" ? "annual" : "monthly";
    const next = new Date();
    next.setDate(next.getDate() + (cycle === "annual" ? 365 : 30));

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "active",
        calls_made: 0,
        total_calls: planConfig.totalCalls,
        next_billing_date: next.toISOString(),
        last_reminder_at: null,
      })
      .eq("id", sub.id);
    if (error) throw error;

    const { sendSubscriptionRenewalEmail } = await import("@/lib/email");
    await sendSubscriptionRenewalEmail(email, {
      name: profile.full_name || undefined,
      planName: planConfig.name,
      totalCalls: planConfig.totalCalls,
      nextBillingDate: next.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }),
    });

    return NextResponse.json({ received: true, renewed: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    // 500 makes Paystack retry the delivery.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
