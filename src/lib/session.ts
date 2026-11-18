import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPathFor, type Role } from "./roles";

/** Current session for server components and layouts, or null when signed out. Cached per request. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/**
 * Real authentication check for private pages. The proxy only looks for a cookie;
 * this verifies the session itself. (The proxy adds the "come back here" redirect
 * for signed-out users, so this fallback only fires for an invalid or expired cookie.)
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

/** Only lets `role` through. Anyone else goes to the dashboard that belongs to them. */
export async function requireRole(role: Role) {
  const session = await requireSession();
  if (session.user.role !== role) redirect(dashboardPathFor(session.user.role));
  return session;
}

/** For /sign-in and /sign-up: signed-in users go straight to their own dashboard. */
export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) redirect(dashboardPathFor(session.user.role));
}
