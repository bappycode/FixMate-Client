import { headers } from "next/headers";
import { auth } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path: string): Promise<Response> {
  const { token } = await auth.api.getToken({ headers: await headers() });

  return fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

const failure = (path: string, response: Response) =>
  new Error(`The server could not load this page (GET ${path} returned ${response.status}).`);

export async function serverApiFetch<T>(path: string): Promise<T> {
  const response = await request(path);
  if (!response.ok) throw failure(path, response);
  return (await response.json()) as T;
}

export async function serverApiFetchOrNull<T>(path: string): Promise<T | null> {
  const response = await request(path);
  if (response.status === 404) return null;
  if (!response.ok) throw failure(path, response);
  return (await response.json()) as T;
}

type SafeResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string };

export async function serverApiFetchSafe<T>(path: string): Promise<SafeResult<T>> {
  const response = await request(path);
  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    return { ok: false, status: response.status, message: body?.message ?? "Something went wrong. Please try again." };
  }
  return { ok: true, data: body as T };
}
