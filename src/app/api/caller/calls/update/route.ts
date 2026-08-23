import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { sendCallStatusUpdate } from "@/lib/email";

// A caller only ever moves a call forward to one of these two outcomes —
// "pending"/"assigned" are earlier states set before the call reaches them.
const CALLER_EDITABLE_STATUSES = new Set(["delivered", "failed"]);

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "caller") {
      return NextResponse.json({ error: "Forbidden: Caller access required" }, { status: 403 });
    }

    const { callId, status, recordingUrl, failureReason } = await req.json();

    if (!callId) {
      return NextResponse.json({ error: "Missing call ID" }, { status: 400 });
    }

    if (status !== undefined && !CALLER_EDITABLE_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      throw new Error("Admin client initialization failure");
    }

    // Fetch scoped to this caller's own assignment — a caller can never see
    // or touch a call assigned to someone else, regardless of callId given.
    const { data: call, error: fetchError } = await supabaseAdmin
      .from("calls")
      .select("*, profiles!user_id(email)")
      .eq("id", callId)
      .eq("assigned_to", payload.id)
      .single();

    if (fetchError || !call) {
      return NextResponse.json({ error: "Call not found or not assigned to you" }, { status: 404 });
    }

    // Callers can only update status/recording/failure reason — never
    // reassign the call or edit customer-facing admin notes.
    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (recordingUrl !== undefined) updates.recording_url = recordingUrl;
    if (failureReason !== undefined) updates.failure_reason = failureReason;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("calls")
      .update(updates)
      .eq("id", callId)
      .eq("assigned_to", payload.id);

    if (updateError) throw updateError;

    if (status !== undefined && call.profiles?.email) {
      await sendCallStatusUpdate(call.profiles.email, {
        status,
        recipientName: call.recipient_name,
        recordingUrl,
        failureReason,
      });
    }

    return NextResponse.json({ message: "Call updated successfully" });
  } catch (error: any) {
    console.error("Caller call update error:", error);
    return NextResponse.json({ error: "Failed to update call" }, { status: 500 });
  }
}
