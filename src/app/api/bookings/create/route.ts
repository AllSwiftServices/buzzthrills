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

    const { recipients, preferences, isExpress } = await request.json();

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

    // 2. Check Credits (Optional but good practice)
    // For now, we'll allow the booking but increment the calls_made count
    
    // 3. Create Call Records
    const callEntries = recipients.map((r: any) => ({
      user_id: payload.id,
      recipient_name: r.name,
      recipient_phone: r.phone,
      occasion_type: r.occasion,
      arrival_date: r.date,
      time_window: r.time,
      is_express: isExpress,
      status: "pending"
    }));

    const { error: insertError } = await supabaseAdmin
      .from("calls")
      .insert(callEntries);

    if (insertError) throw insertError;

    // 4. Update Subscription Usage
    await supabaseAdmin
      .from("subscriptions")
      .update({ calls_made: (subscription.calls_made || 0) + callEntries.length })
      .eq("id", subscription.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
