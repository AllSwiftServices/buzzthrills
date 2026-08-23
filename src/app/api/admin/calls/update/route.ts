import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { sendCallStatusUpdate, sendCallAssignmentEmail } from "@/lib/email";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { callId, status, recordingUrl, adminNotes, failureReason, assignedTo } = await req.json();

    if (!callId) {
      return NextResponse.json({ error: "Missing call ID" }, { status: 400 });
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

    // 2. Update only the fields that were actually provided — this route is
    // used both for the full status/recording workflow and for a lightweight
    // "assign this call to a staff member" action that doesn't touch status.
    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (recordingUrl !== undefined) updates.recording_url = recordingUrl;
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    if (failureReason !== undefined) updates.failure_reason = failureReason;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo || null;

    // Assigning/unassigning a staff member moves status along the lifecycle
    // automatically, unless this same request already set status explicitly.
    if (assignedTo !== undefined && status === undefined) {
      if (assignedTo && call.status === "pending") {
        updates.status = "assigned";
      } else if (!assignedTo && call.status === "assigned") {
        updates.status = "pending";
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data: updatedCall, error: updateError } = await supabaseAdmin
      .from("calls")
      .update(updates)
      .eq("id", callId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Send notification email to the booker, only when the status actually changed
    if (status !== undefined && call.profiles?.email) {
      await sendCallStatusUpdate(call.profiles.email, {
        status,
        recipientName: call.recipient_name,
        recordingUrl,
        adminNotes,
        failureReason,
      });
    }

    // 4. Notify the newly assigned staff member — only when assignment is
    // actually being set to someone new, not cleared or left unchanged.
    if (assignedTo && assignedTo !== call.assigned_to) {
      const { data: staffMember } = await supabaseAdmin
        .from("profiles")
        .select("full_name, email")
        .eq("id", assignedTo)
        .single();

      if (staffMember?.email) {
        await sendCallAssignmentEmail(staffMember.email, {
          staffName: staffMember.full_name || "there",
          recipientName: call.recipient_name,
          recipientPhone: call.recipient_phone,
          occasionType: call.occasion_type,
          occasionDate: new Date(call.occasion_date).toLocaleDateString(),
          scheduledSlot: call.scheduled_slot,
        });
      }
    }

    return NextResponse.json({ message: "Call updated successfully", call: updatedCall });
  } catch (error: any) {
    console.error("Call update error:", error);
    return NextResponse.json({ error: "Failed to update call" }, { status: 500 });
  }
}
