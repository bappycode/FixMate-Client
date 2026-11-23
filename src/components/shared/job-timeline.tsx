import { Check } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking, BookingHistoryEntry } from "@/types/booking";
import { STATUS_STYLES } from "./booking-badges";

type TimelineStatus = BookingHistoryEntry["status"];

const HAPPY_PATH: TimelineStatus[] = ["requested", "accepted", "in-progress", "completed", "paid"];

const labelOf = (status: TimelineStatus) => (status === "paid" ? "Paid" : STATUS_STYLES[status].label);

function stepsOf(booking: Booking): BookingHistoryEntry[] {
  if (booking.statusHistory && booking.statusHistory.length > 0) return booking.statusHistory;

  const steps: BookingHistoryEntry[] = [{ status: "requested", changedAt: booking.createdAt }];
  if (booking.status !== "requested") steps.push({ status: booking.status, changedAt: booking.updatedAt });
  if (booking.paymentStatus === "paid") steps.push({ status: "paid", changedAt: booking.updatedAt });
  return steps;
}

export function JobTimeline({ booking }: { booking: Booking }) {
  const done = stepsOf(booking);
  const last = done[done.length - 1].status;
  const lastIndex = HAPPY_PATH.indexOf(last);
  const upcoming = lastIndex === -1 ? [] : HAPPY_PATH.slice(lastIndex + 1);

  return (
    <ol className="flex flex-col" aria-label={`Timeline of ${booking.serviceTitle}`}>
      {done.map((step, index) => {
        const current = index === done.length - 1 && upcoming.length > 0;
        const isLast = index === done.length - 1 && upcoming.length === 0;

        return (
          <li key={`${step.status}-${step.changedAt}`} className="relative flex gap-3 pb-4 last:pb-0" aria-current={current ? "step" : undefined}>
            {!isLast ? <span aria-hidden className="absolute top-6 left-[11px] h-[calc(100%-1.5rem)] w-px bg-primary/40" /> : null}
            <span
              aria-hidden
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground",
                current && "ring-4 ring-primary/20",
              )}
            >
              <Check className="size-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{labelOf(step.status)}</span>
              <time dateTime={step.changedAt} className="text-xs text-muted-foreground">
                {formatDateTime(step.changedAt)}
              </time>
            </div>
          </li>
        );
      })}

      {upcoming.map((status, index) => (
        <li key={status} className="relative flex gap-3 pb-4 last:pb-0 text-muted-foreground">
          {index < upcoming.length - 1 ? <span aria-hidden className="absolute top-6 left-[11px] h-[calc(100%-1.5rem)] w-px bg-border" /> : null}
          <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-[10px] font-semibold">
            {HAPPY_PATH.indexOf(status) + 1}
          </span>
          <span className="pt-0.5 text-sm">
            {labelOf(status)}
            <span className="sr-only"> (not reached yet)</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
