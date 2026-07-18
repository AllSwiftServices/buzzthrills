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

    // full_name/email/role/is_suspended are kept in sync with auth_accounts by
    // a DB trigger (see src/db/migrations/0002_sync_profiles_auth_accounts_fields.sql)
    // — no need to write auth_accounts here too.

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

    // Accounts live in auth_accounts (custom auth, not Supabase Auth — there
    // is no matching auth.users row to delete). profiles.id references
    // auth_accounts.id ON DELETE CASCADE, so removing the account row here
    // also removes the profile in the same statement.
    const { error: authAccountError } = await supabaseAdmin
      .from("auth_accounts")
      .delete()
      .eq("id", userId);

    if (authAccountError) throw authAccountError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Users DELETE failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
