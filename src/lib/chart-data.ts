import { STATUS_STYLES } from "@/components/shared/booking-badges";
import type { Booking, BookingStatus } from "@/types/booking";

export type ChartPoint = { label: string; value: number };

export const STATUS_ORDER: BookingStatus[] = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export function bookingsByStatus(bookings: Pick<Booking, "status">[]): ChartPoint[] {
  return STATUS_ORDER.map((status) => ({
    label: STATUS_STYLES[status].label,
    value: bookings.filter((booking) => booking.status === status).length,
  }));
}

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

export function formatMonth(month: string): string {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}
