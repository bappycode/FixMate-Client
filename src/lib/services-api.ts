import type { PublicService, ServiceDetails } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getLatestServices(limit = 6): Promise<PublicService[]> {
  if (!API_URL) return [];

  try {
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

const SERVICES_PER_PAGE = 12;

export type ServiceFilters = { search?: string; category?: string; mode?: string; sort?: string; page?: string };

type ServicePage = { services: PublicService[]; total: number; page: number; pageSize: number };

export async function getServices(filters: ServiceFilters): Promise<ServicePage> {
  const query = new URLSearchParams({ limit: String(SERVICES_PER_PAGE) });
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }

  const response = await fetch(`${API_URL}/api/services?${query}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load services (the server answered ${response.status}).`);

  return (await response.json()) as ServicePage;
}

export async function getService(id: string): Promise<ServiceDetails | null> {
  const response = await fetch(`${API_URL}/api/services/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Could not load this service (the server answered ${response.status}).`);

  return (await response.json()) as ServiceDetails;
}
