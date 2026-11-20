"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { BookingServiceCell } from "@/components/bookings/booking-service-cell";
import { PaymentBadge, StatusBadge, STATUS_STYLES } from "@/components/shared/booking-badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types/booking";

type Filter = BookingStatus | "all";

// Read-only: the admin watches every job on the platform but does not change them.
export function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No bookings yet"
        description="Repair requests from customers will appear here."
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="booking-status-filter" className="text-sm font-medium">
          Status
        </label>
        <select
          id="booking-status-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value as Filter)}
          className="h-10 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All statuses ({bookings.length})</option>
          {(Object.keys(STATUS_STYLES) as BookingStatus[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_STYLES[status].label} ({bookings.filter((booking) => booking.status === status).length})
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nothing here" description="No bookings have this status." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="pr-4 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="pl-4">
                    <BookingServiceCell booking={booking} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.customerName}</span>
                      <span className="text-xs text-muted-foreground">{booking.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.technicianName}</span>
                      <span className="text-xs text-muted-foreground">{booking.technicianEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(booking.preferredDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentBadge status={booking.paymentStatus} />
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium">
                    {formatPrice(booking.status === "completed" ? booking.finalAmount : booking.basePrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
