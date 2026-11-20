import type { Metadata } from "next";
import { CircleCheck, ClipboardList, Hammer } from "lucide-react";
import { BarChartCard } from "@/components/dashboard/bar-chart";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { bookingsByStatus } from "@/lib/chart-data";
import { requireSession } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = { title: "Overview" };

const ACTIVE = ["requested", "accepted", "in-progress"];

export default async function CustomerOverviewPage() {
  const { user } = await requireSession();
  const { bookings } = await serverApiFetch<{ bookings: Booking[] }>("/api/bookings/my");

  const active = bookings.filter((booking) => ACTIVE.includes(booking.status)).length;
  const completed = bookings.filter((booking) => booking.status === "completed").length;

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Here is where your repair requests stand." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Requests" value={bookings.length} icon={ClipboardList} />
        <StatCard label="Active Jobs" value={active} icon={Hammer} />
        <StatCard label="Completed Jobs" value={completed} icon={CircleCheck} />
      </div>

      <div className="mt-6">
        <ChartPanel title="Your requests by status" description="Where each of your repair requests stands.">
          <BarChartCard valueName="Requests" data={bookingsByStatus(bookings)} />
        </ChartPanel>
      </div>
    </>
  );
}
