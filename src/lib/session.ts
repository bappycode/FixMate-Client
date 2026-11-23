import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPathFor, type Role } from "./roles";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireSession();
  if (session.user.role !== role) redirect(dashboardPathFor(session.user.role));
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) redirect(dashboardPathFor(session.user.role));
}
