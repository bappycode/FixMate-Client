import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { CustomerBookingsTable } from "@/components/bookings/customer-bookings-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { buttonVariants } from "@/components/ui/button";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = { title: "My Bookings" };

export default async function CustomerBookingsPage() {
  const { bookings } = await serverApiFetch<{ bookings: Booking[] }>("/api/bookings/my");

  return (
    <>
      <PageHeader
        title="My bookings"
        description="Track every repair request. You can cancel one while it is still requested."
        action={
          <Link href="/services" className={buttonVariants({ size: "lg" })}>
            <Search aria-hidden /> Find a technician
          </Link>
        }
      />
      <CustomerBookingsTable initialBookings={bookings} />
    </>
  );
}
