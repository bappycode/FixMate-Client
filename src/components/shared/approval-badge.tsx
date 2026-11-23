import { cn } from "@/lib/utils";
import type { Service } from "@/types/service";

const STYLES: Record<Service["approvalStatus"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  approved: { label: "Approved", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
};

export function ApprovalBadge({ status }: { status: Service["approvalStatus"] }) {
  const { label, className } = STYLES[status];

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>
      {label}
    </span>
  );
}
