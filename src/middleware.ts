import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-buzz-thrills-key-12345"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Define Protected Routes
  const isProfileRoute = pathname.startsWith("/profile");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  // 2. Identify the Access Token
  // We check the Authorization header first, then the cookie (if implemented for SSR)
  let token = req.headers.get("authorization")?.split(" ")[1];
  
  // Also check for a session cookie if your AuthContext stores it there
  if (!token) {
    token = req.cookies.get("access_token")?.value;
  }

  // 3. Logic for Protected Routes
  if (isProfileRoute || isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      
      // Admin Role Check
      if (isAdminRoute && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
      
      // If valid, continue
      return NextResponse.next();
    } catch (error) {
      // Token invalid or expired
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  // 4. Logic for Auth Routes (Don't show login if already logged in)
  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.redirect(new URL("/profile", req.url));
    } catch (e) {
      // Token invalid, allow them to stay on auth
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// 5. Matcher Configuration
export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
