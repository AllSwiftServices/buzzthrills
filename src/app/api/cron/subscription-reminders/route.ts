import { NextResponse } from "next/server";
import { getPlan } from "@/lib/plans";

// Runs daily (see vercel.json). Nudges active subscribers who still haven't
// scheduled any call this cycle, once per cycle, a day or more after it began.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { supabaseAdmin } = await import("@/lib/supabase");
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin client unavailable" }, { status: 500 });

  const { sendScheduleCallsReminder } = await import("@/lib/email");
  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const { data: subs, error } = await supabaseAdmin
    .from("subscriptions")
    .select("id, user_id, plan, billing_cycle, calls_made, total_calls, start_date, next_billing_date, last_reminder_at")
    .eq("status", "active")
    .eq("calls_made", 0)
    .gt("total_calls", 0);
  if (error) return NextResponse.json({ error: "Query failed" }, { status: 500 });

  let sent = 0;
  for (const sub of subs || []) {
    const cycleDays = sub.billing_cycle === "annual" ? 365 : 30;
    const cycleStart = sub.next_billing_date
      ? new Date(sub.next_billing_date).getTime() - cycleDays * DAY
      : new Date(sub.start_date).getTime();

    if (sub.next_billing_date && new Date(sub.next_billing_date).getTime() < now) continue; // lapsed
    if (now - cycleStart < DAY) continue; // give them a day first
    if (sub.last_reminder_at && new Date(sub.last_reminder_at).getTime() >= cycleStart) continue; // already nudged this cycle

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("id", sub.user_id)
      .maybeSingle();
    if (!profile?.email) continue;

    await sendScheduleCallsReminder(profile.email, {
      name: profile.full_name || undefined,
      planName: getPlan(sub.plan)?.name || "BuzzThrills",
      callsLeft: sub.total_calls,
    });
    await supabaseAdmin.from("subscriptions").update({ last_reminder_at: new Date().toISOString() }).eq("id", sub.id);
    sent++;
  }

  return NextResponse.json({ checked: subs?.length || 0, sent });
}
