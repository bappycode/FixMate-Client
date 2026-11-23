import type { CategoryName } from "@/lib/categories";

export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export type BookingHistoryEntry = { status: BookingStatus | "paid"; changedAt: string };

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
  statusHistory?: BookingHistoryEntry[];
  createdAt: string;
  updatedAt: string;
};
