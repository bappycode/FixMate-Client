"use client";

import { useState } from "react";
import { Check, Inbox, Loader2, PlayCircle, X } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PaymentBadge, StatusBadge } from "@/components/shared/booking-badges";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";
import { validateFinalAmount } from "@/lib/booking-validation";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types/booking";
import { BookingServiceCell } from "./booking-service-cell";

type Filter = "all" | "requested" | "accepted" | "in-progress" | "completed";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const SUCCESS_TEXT: Partial<Record<BookingStatus, string>> = {
  accepted: "Request accepted.",
  rejected: "Request rejected.",
  "in-progress": "Work started.",
  completed: "Job completed. The customer can now pay.",
};

export function TechnicianRequestsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<Filter>("all");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [toReject, setToReject] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string>();

  const visible = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);
  const countOf = (value: Filter) =>
    value === "all" ? bookings.length : bookings.filter((booking) => booking.status === value).length;

  // Every job change goes through here: one request to the server, which enforces the pipeline.
  async function changeStatus(booking: Booking, status: BookingStatus, finalAmount?: number): Promise<boolean> {
    setWorkingId(booking._id);
    try {
      const { booking: updated } = await apiFetch<{ booking: Booking }>(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, finalAmount }),
      });
      setBookings((list) => list.map((item) => (item._id === updated._id ? updated : item)));
      toast.success(SUCCESS_TEXT[status] ?? "Job updated.");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the job.");
      return false;
    } finally {
      setWorkingId(null);
    }
  }

  function openComplete(booking: Booking) {
    setCompleting(booking);
    setAmount(String(booking.basePrice)); // pre-filled with the base price
    setAmountError(undefined);
  }

  async function submitComplete(event: React.FormEvent) {
    event.preventDefault();
    if (!completing) return;

    const problem = validateFinalAmount(amount);
    setAmountError(problem);
    if (problem) return;

    if (await changeStatus(completing, "completed", Number(amount))) setCompleting(null);
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No requests yet"
        description="When a customer requests one of your services, it shows up here for you to accept or reject."
      />
    );
  }

  return (
    <>
      <FilterTabs
        label="Filter requests by status"
        value={filter}
        onChange={setFilter}
        options={FILTERS.map(({ value, label }) => ({ value, label, count: countOf(value) }))}
      />

      {visible.length === 0 ? (
        <EmptyState icon={Inbox} title="Nothing here" description="No requests have this status right now." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Address and date</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((booking) => {
                const busy = workingId === booking._id;
                return (
                  <TableRow key={booking._id}>
                    <TableCell className="pl-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.customerName}</span>
                        <a href={`tel:${booking.customerPhone.replace(/[^\d+]/g, "")}`} className="text-xs text-primary hover:underline">
                          {booking.customerPhone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <BookingServiceCell booking={booking} />
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-56 flex-col">
                        <span className="truncate" title={booking.address}>
                          {booking.address}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(booking.preferredDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-2 max-w-64 text-sm whitespace-normal" title={booking.problemDescription}>
                        {booking.problemDescription}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="pr-4">
                      {/* Only the actions that are valid for this status are shown. */}
                      <div className="flex justify-end gap-2">
                        {booking.status === "requested" ? (
                          <>
                            <Button size="lg" disabled={busy} onClick={() => changeStatus(booking, "accepted")}>
                              <Check aria-hidden /> Accept
                            </Button>
                            <Button variant="destructive" size="lg" disabled={busy} onClick={() => setToReject(booking)}>
                              <X aria-hidden /> Reject
                            </Button>
                          </>
                        ) : null}
                        {booking.status === "accepted" ? (
                          <Button size="lg" disabled={busy} onClick={() => changeStatus(booking, "in-progress")}>
                            <PlayCircle aria-hidden /> Start Work
                          </Button>
                        ) : null}
                        {booking.status === "in-progress" ? (
                          <Button size="lg" disabled={busy} onClick={() => openComplete(booking)}>
                            <Check aria-hidden /> Mark Completed
                          </Button>
                        ) : null}
                        {booking.status === "completed" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{formatPrice(booking.finalAmount)}</span>
                            <PaymentBadge status={booking.paymentStatus} />
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={toReject !== null}
        onOpenChange={(open) => {
          if (!open) setToReject(null);
        }}
        title="Reject this request?"
        description={`${toReject?.customerName ?? "The customer"} will be told their request for "${toReject?.serviceTitle ?? ""}" was rejected. This cannot be undone.`}
        confirmLabel="Reject request"
        destructive
        pending={workingId !== null}
        onConfirm={async () => {
          if (toReject && (await changeStatus(toReject, "rejected"))) setToReject(null);
        }}
      />

      <Dialog
        open={completing !== null}
        onOpenChange={(open) => {
          if (!open && workingId === null) setCompleting(null);
        }}
      >
        <DialogContent>
          <form onSubmit={submitComplete} noValidate className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Mark job completed</DialogTitle>
              <DialogDescription>
                Enter the final amount for &quot;{completing?.serviceTitle}&quot;. The customer pays this amount online
                after you complete the job.
              </DialogDescription>
            </DialogHeader>

            <FormField
              id="finalAmount"
              label="Final amount (USD)"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                if (amountError) setAmountError(validateFinalAmount(event.target.value));
              }}
              error={amountError}
            />

            <DialogFooter>
              <Button type="button" variant="outline" disabled={workingId !== null} onClick={() => setCompleting(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={workingId !== null}>
                {workingId !== null ? <Loader2 className="animate-spin" aria-hidden /> : null}
                Complete job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
