import type { CategoryName, ServiceMode } from "@/lib/categories";

/** A service as returned by the Express API (JSON, so ids and dates are strings). */
export type Service = {
  _id: string;
  title: string;
  category: CategoryName;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
};

/** What the public endpoints return: the technician's email is never sent to visitors. */
export type PublicService = Omit<Service, "technicianEmail">;

/** GET /api/services/:id: the service plus a public summary of its technician. */
export type ServiceDetails = {
  service: PublicService;
  technician: { name: string; image: string | null; area: string; bio: string };
};
