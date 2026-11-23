import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data, error } = await authClient.token();
  if (error || !data) {
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
        Authorization: `Bearer ${data.token}`,
      },
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.message ?? "Something went wrong. Please try again.", response.status);
  }
  return body as T;
}
