import type { Metadata } from "next";
import { AdminBookingsTable } from "@/components/admin/bookings-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = { title: "All Bookings" };

export default async function AdminBookingsPage() {
  const { bookings } = await serverApiFetch<{ bookings: Booking[] }>("/api/admin/bookings");

  return (
    <>
      <PageHeader title="All bookings" description="Every repair job on the platform. This view is read-only." />
      <AdminBookingsTable bookings={bookings} />
    </>
  );
}
