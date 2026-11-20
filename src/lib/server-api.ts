import { headers } from "next/headers";
import { auth } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Calls the Express API from a server component, as the signed-in user.
// Better Auth mints a short-lived JWT from the request's session cookie, and it is sent
// as "Authorization: Bearer <token>", exactly like apiFetch does from the browser.
async function request(path: string): Promise<Response> {
  const { token } = await auth.api.getToken({ headers: await headers() });

  return fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", // dashboard data is per user and must always be fresh
  });
}

const failure = (path: string, response: Response) =>
  new Error(`The server could not load this page (GET ${path} returned ${response.status}).`);

/**
 * GET for the data a dashboard page needs on first load (use apiFetch from the browser
 * for actions). Any failure throws, which shows the error page.
 */
export async function serverApiFetch<T>(path: string): Promise<T> {
  const response = await request(path);
  if (!response.ok) throw failure(path, response);
  return (await response.json()) as T;
}

/** Like serverApiFetch, but a 404 returns null, so the page can call notFound(). */
export async function serverApiFetchOrNull<T>(path: string): Promise<T | null> {
  const response = await request(path);
  if (response.status === 404) return null;
  if (!response.ok) throw failure(path, response);
  return (await response.json()) as T;
}

type SafeResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string };

/**
 * Like serverApiFetch, but a refusal comes back as data instead of an exception, with the
 * server's own message. For pages that explain a failure to the person, such as "this
 * payment was not completed", instead of showing the generic error page.
 */
export async function serverApiFetchSafe<T>(path: string): Promise<SafeResult<T>> {
  const response = await request(path);
  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    return { ok: false, status: response.status, message: body?.message ?? "Something went wrong. Please try again." };
  }
  return { ok: true, data: body as T };
}
