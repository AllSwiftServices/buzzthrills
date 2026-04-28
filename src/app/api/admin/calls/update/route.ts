import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendCallStatusUpdate } from "@/lib/email";

export async function PATCH(req: Request) {
  try {
    const { callId, status, recordingUrl, adminNotes, failureReason } = await req.json();

    if (!callId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin Client initialization failure");
    }

    // 1. Fetch the call details first (to get the user's email and recipient name)
    const { data: call, error: fetchError } = await supabaseAdmin
      .from("calls")
      .select("*, profiles!user_id(email)")
      .eq("id", callId)
      .single();

    if (fetchError || !call) {
      throw new Error("Call not found");
    }

    // 2. Update the call status and notes
    const { error: updateError } = await supabaseAdmin
      .from("calls")
      .update({
        status,
        recording_url: recordingUrl,
        admin_notes: adminNotes,
        failure_reason: failureReason,
      })
      .eq("id", callId);

    if (updateError) throw updateError;

    // 3. Send notification email to the booker
    if (call.profiles?.email) {
      await sendCallStatusUpdate(call.profiles.email, {
        status,
        recipientName: call.recipient_name,
        recordingUrl,
        adminNotes,
        failureReason,
      });
    }

    return NextResponse.json({ message: "Call updated successfully" });
  } catch (error: any) {
    console.error("Call update error:", error);
    return NextResponse.json({ error: "Failed to update call" }, { status: 500 });
  }
}
