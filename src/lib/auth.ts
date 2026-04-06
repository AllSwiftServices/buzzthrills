import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-buzz-thrills-key-12345"
);

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function signAccessToken(payload: { id: string; email: string; role: string }) {
  return await new SignJWT({
    ...payload,
    sub: payload.id, // Supabase standard for User ID
    role: payload.role, // Supabase standard for User Role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES)
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  return await verifyToken(token);
}

export function setAccessTokenCookie(res: NextResponse, token: string) {
  res.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60, // 15 minutes (match access token expiry)
    path: "/",
  });
}

export function setRefreshTokenCookie(res: NextResponse, token: string) {
  res.cookies.set("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRES / 1000,
    path: "/",
  });
}
