import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus } from "@/types/booking";

// One set of colors for job and payment states, used on every dashboard:
// requested = blue, accepted = indigo, in progress = amber, completed = green, rejected = red, cancelled = gray.
export const STATUS_STYLES: Record<BookingStatus, { label: string; className: string }> = {
  requested: { label: "Requested", className: "bg-blue-100 text-blue-800" },
  accepted: { label: "Accepted", className: "bg-indigo-100 text-indigo-800" },
  "in-progress": { label: "In Progress", className: "bg-amber-100 text-amber-800" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", className: "bg-gray-200 text-gray-700" },
};

const PAYMENT_STYLES: Record<PaymentStatus, { label: string; className: string }> = {
  unpaid: { label: "Unpaid", className: "bg-slate-100 text-slate-700" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800" },
};

const BADGE = "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return <span className={cn(BADGE, className)}>{label}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const { label, className } = PAYMENT_STYLES[status];
  return <span className={cn(BADGE, className)}>{label}</span>;
}
