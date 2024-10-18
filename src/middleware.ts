import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware untuk memeriksa apakah user sudah login
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const userId = req.cookies.get("userId");

  // Jika userId tidak ada, redirect ke halaman login
  if (!userId && url.pathname.startsWith("/profile")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Tentukan halaman yang harus dilindungi
export const config = {
  matcher: ["/profile", "/movie"],
};
