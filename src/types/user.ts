import type { Role } from "@/lib/roles";

/** A user as listed on the admin Users page (GET /api/admin/users). */
export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  createdAt: string;
};
