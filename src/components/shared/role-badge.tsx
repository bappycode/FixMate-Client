import { cn } from "@/lib/utils";
import { isRole, ROLE_LABELS, type Role } from "@/lib/roles";

const ROLE_STYLES: Record<Role, string> = {
  customer: "bg-tint text-primary",
  technician: "bg-ink text-white",
  admin: "bg-cta/10 text-cta",
};

export function RoleBadge({ role, className }: { role: unknown; className?: string }) {
  const safeRole: Role = isRole(role) ? role : "customer";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        ROLE_STYLES[safeRole],
        className,
      )}
    >
      {ROLE_LABELS[safeRole]}
    </span>
  );
}
