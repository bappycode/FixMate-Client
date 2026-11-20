import { STATUS_STYLES } from "@/components/shared/booking-badges";
import type { Booking, BookingStatus } from "@/types/booking";

/** One bar: a name under it and how tall it is. */
export type ChartPoint = { label: string; value: number };

/** The pipeline order, so bars always read left to right like the job does. */
export const STATUS_ORDER: BookingStatus[] = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

/** How many bookings are in each status. Every status gets a bar, even with 0. */
export function bookingsByStatus(bookings: Pick<Booking, "status">[]): ChartPoint[] {
  return STATUS_ORDER.map((status) => ({
    label: STATUS_STYLES[status].label,
    value: bookings.filter((booking) => booking.status === status).length,
  }));
}

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

/** "2026-11" -> "Nov 26". */
export function formatMonth(month: string): string {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}
