import type { Metadata } from "next";
import { TechnicianRequestsTable } from "@/components/bookings/technician-requests-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = { title: "Manage Requests" };

export default async function TechnicianRequestsPage() {
  const { bookings } = await serverApiFetch<{ bookings: Booking[] }>("/api/bookings/technician");

  return (
    <>
      <PageHeader
        title="Manage requests"
        description="Accept or reject new requests, then move each job forward until it is completed."
      />
      <TechnicianRequestsTable initialBookings={bookings} />
    </>
  );
}
