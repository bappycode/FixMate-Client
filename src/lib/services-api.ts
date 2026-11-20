import type { PublicService, ServiceDetails } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * The newest approved, available services, for the home page.
 *
 * API contract (implemented in the Express server, routes/services.ts):
 *   GET /api/services?sort=newest&limit=6  ->  { services: PublicService[] }
 *
 * Any failure (API not deployed yet, network error, bad response) returns an
 * empty list, so the home page shows its empty state instead of crashing.
 */
export async function getLatestServices(limit = 6): Promise<PublicService[]> {
  if (!API_URL) return [];

  try {
    // Re-fetched at most once a minute, so the home page stays fast but fresh.
    const response = await fetch(`${API_URL}/api/services?sort=newest&limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as { services?: PublicService[] };
    return Array.isArray(data.services) ? data.services : [];
  } catch {
    return [];
  }
}

/** How many services the browse page shows at once. */
const SERVICES_PER_PAGE = 12;

/** The filters of the browse page. They live in the URL: /services?search=&category=&mode=&sort=&page= */
export type ServiceFilters = { search?: string; category?: string; mode?: string; sort?: string; page?: string };

/** One page of the browse list, plus how many services match the filters in all. */
type ServicePage = { services: PublicService[]; total: number; page: number; pageSize: number };

/**
 * One page of services for the browse page. Searching, filtering, sorting and paging all happen
 * in MongoDB, on the Express server: this just passes the filters along.
 * Unlike the home page, a failure here throws, so the error page (with "Try again") shows.
 */
export async function getServices(filters: ServiceFilters): Promise<ServicePage> {
  const query = new URLSearchParams({ limit: String(SERVICES_PER_PAGE) });
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }

  const response = await fetch(`${API_URL}/api/services?${query}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load services (the server answered ${response.status}).`);

  return (await response.json()) as ServicePage;
}

/** One public service with its technician's summary, or null when it does not exist (404). */
export async function getService(id: string): Promise<ServiceDetails | null> {
  const response = await fetch(`${API_URL}/api/services/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Could not load this service (the server answered ${response.status}).`);

  return (await response.json()) as ServiceDetails;
}
