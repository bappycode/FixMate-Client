import type { CategoryName, ServiceMode } from "@/lib/categories";

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

export type PublicService = Omit<Service, "technicianEmail">;

export type ServiceDetails = {
  service: PublicService;
  technician: { name: string; image: string | null; area: string; bio: string };
};
