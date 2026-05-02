import { NextResponse } from "next/server";

export async function POST() {
  // Silently consume rogue NextAuth log requests
  return NextResponse.json({ success: true });
}
