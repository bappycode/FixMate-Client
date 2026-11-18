import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { REDIRECT_PARAM } from "@/lib/safe-redirect";

/**
 * Optimistic check only: is there a session cookie at all? No database call here.
 * The real session and role checks run server-side in the dashboard layouts.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set(REDIRECT_PARAM, request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
};
