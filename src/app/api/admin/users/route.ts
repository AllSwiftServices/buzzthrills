import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (!supabaseAdmin) throw new Error("Supabase Admin client missing");

    // Fetch all profiles with their active subscriptions
    const { data: users, error } = await supabaseAdmin
      .from("profiles")
      .select(`
        *,
        subscriptions (
          plan,
          status,
          next_billing_date
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin Users GET failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId, updates } = await req.json();
    if (!userId || !updates) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    if (!supabaseAdmin) throw new Error("Supabase Admin client missing");

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin Users PATCH failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing User ID" }, { status: 400 });

    if (!supabaseAdmin) throw new Error("Supabase Admin client missing");

    // Also delete from auth.users (requires service role)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // profiles deletion should be cascading if foreign keys are set correctly
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Users DELETE failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
