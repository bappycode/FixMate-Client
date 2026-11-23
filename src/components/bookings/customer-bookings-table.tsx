"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown, ClipboardList, Search, X } from "lucide-react";
import { toast } from "sonner";
import { PayNowButton } from "@/components/payments/pay-now-button";
import { PaymentBadge, StatusBadge } from "@/components/shared/booking-badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { JobTimeline } from "@/components/shared/job-timeline";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import { BookingServiceCell } from "./booking-service-cell";

export function CustomerBookingsTable({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [trackedId, setTrackedId] = useState<string | null>(null);

  async function confirmCancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      const { booking: updated } = await apiFetch<{ booking: Booking }>(
        `/api/bookings/${toCancel._id}/cancel`,
        {
          method: "PATCH",
        },
      );
      setBookings((list) =>
        list.map((item) => (item._id === updated._id ? updated : item)),
      );
      toast.success("Your request was cancelled.");
      setToCancel(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not cancel the request.",
      );
    } finally {
      setCancelling(false);
    }
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="You have no bookings yet"
        description="Find a technician for your device or appliance and send your first repair request."
        action={
          <Link href="/services" className={buttonVariants({ size: "lg" })}>
            <Search aria-hidden /> Browse services
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table className="min-w-[960px]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Preferred date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <Fragment key={booking._id}>
                <TableRow>
                  <TableCell className="pl-4">
                    <BookingServiceCell booking={booking} />
                  </TableCell>
                  <TableCell>{booking.technicianName}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(booking.preferredDate)}
                  </TableCell>
                  <TableCell>
                    {booking.status === "completed" ? (
                      <span className="font-medium">
                        {formatPrice(booking.finalAmount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        From{" "}
                        <span className="font-medium text-foreground">
                          {formatPrice(booking.basePrice)}
                        </span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentBadge status={booking.paymentStatus} />
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        aria-expanded={trackedId === booking._id}
                        aria-controls={`timeline-${booking._id}`}
                        onClick={() =>
                          setTrackedId(
                            trackedId === booking._id ? null : booking._id,
                          )
                        }
                      >
                        Track{" "}
                        <ChevronDown
                          className={cn(
                            "transition-transform",
                            trackedId === booking._id && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </Button>
                      {booking.status === "requested" ? (
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={() => setToCancel(booking)}
                        >
                          <X aria-hidden /> Cancel
                        </Button>
                      ) : null}
                      {booking.status === "completed" &&
                      booking.paymentStatus === "unpaid" ? (
                        <PayNowButton bookingId={booking._id} />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
                {trackedId === booking._id ? (
                  <TableRow
                    id={`timeline-${booking._id}`}
                    className="bg-muted/30 hover:bg-muted/30"
                  >
                    <TableCell
                      colSpan={7}
                      className="px-6 py-5 whitespace-normal"
                    >
                      <JobTimeline booking={booking} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={toCancel !== null}
        onOpenChange={(open) => {
          if (!open) setToCancel(null);
        }}
        title="Cancel this request?"
        description={`Your request for "${toCancel?.serviceTitle ?? ""}" will be cancelled. You can send a new request later.`}
        confirmLabel="Cancel request"
        destructive
        pending={cancelling}
        onConfirm={confirmCancel}
      />
    </>
  );
}
