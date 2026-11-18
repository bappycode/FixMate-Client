export const ROLES = ["customer", "technician", "admin"] as const;
export type Role = (typeof ROLES)[number];

// Admin can never be chosen at sign-up.
export const SIGN_UP_ROLES = ["customer", "technician"] as const;
export type SignUpRole = (typeof SIGN_UP_ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Home dashboard for a role. Unknown roles fall back to the customer dashboard. */
export function dashboardPathFor(role: unknown): string {
  return `/dashboard/${isRole(role) ? role : "customer"}`;
}
