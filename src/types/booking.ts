import type { CategoryName } from "@/lib/categories";

export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

/** One step in a job's timeline. "paid" comes after "completed" once the customer has paid. */
export type BookingHistoryEntry = { status: BookingStatus | "paid"; changedAt: string };

/** A booking (repair job) as returned by the Express API (JSON, so ids and dates are strings). */
export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: CategoryName;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  /** The job's timeline, oldest first. Bookings from before the timeline existed do not have it. */
  statusHistory?: BookingHistoryEntry[];
  createdAt: string;
  updatedAt: string;
};
