import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const userId = req.cookies.get("userId"); // Ambil userId dari cookie

  // Jika userId tidak ada, redirect ke halaman login
  if (
    !userId &&
    (url.pathname.startsWith("/profile") || url.pathname.startsWith("/movie"))
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url); // Redirect ke halaman login jika belum login
  }

  return NextResponse.next();
}

// Tentukan halaman yang harus dilindungi
export const config = {
  matcher: ["/profile", "/movie"], // Halaman movie dan profile dilindungi middleware
};
