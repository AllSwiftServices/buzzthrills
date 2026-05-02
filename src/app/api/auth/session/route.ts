import { NextResponse } from "next/server";

export async function GET() {
  // Return an empty session to silence rogue NextAuth client pings from other tabs on localhost:3000
  return NextResponse.json(null);
}
