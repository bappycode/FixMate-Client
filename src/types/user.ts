import type { Role } from "@/lib/roles";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  createdAt: string;
};
