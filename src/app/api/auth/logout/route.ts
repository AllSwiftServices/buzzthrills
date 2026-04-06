import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!supabaseAdmin) {
       throw new Error("Administrative Client Mission Failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    if (!refreshToken) {
       throw new Error("Administrative Client Mission Failure: Check SUPABASE_SERVICE_ROLE_KEY");
    }

    if (refreshToken) {
      // 1. Invalidate Session in DB
      await supabaseAdmin
        .from("auth_sessions")
        .delete()
        .eq("refresh_token", refreshToken);
    }

    // 2. Clear Cookies
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("refresh_token");
    response.cookies.delete("access_token");

    return response;

  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
