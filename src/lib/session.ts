import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPathFor } from "./roles";

/** Current session for server components and layouts, or null when signed out. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For /sign-in and /sign-up: signed-in users go straight to their own dashboard. */
export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) redirect(dashboardPathFor(session.user.role));
}
