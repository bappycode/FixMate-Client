import type { Service } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * The newest approved, available services, for the home page.
 *
 * API contract (the Express endpoint will be built to match this):
 *   GET /api/services?sort=newest&limit=6  ->  { services: Service[] }
 *
 * Any failure (API not deployed yet, network error, bad response) returns an
 * empty list, so the home page shows its empty state instead of crashing.
 */
export async function getLatestServices(limit = 6): Promise<Service[]> {
  if (!API_URL) return [];

  try {
    // Re-fetched at most once a minute, so the home page stays fast but fresh.
    const response = await fetch(`${API_URL}/api/services?sort=newest&limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as { services?: Service[] };
    return Array.isArray(data.services) ? data.services : [];
  } catch {
    return [];
  }
}
