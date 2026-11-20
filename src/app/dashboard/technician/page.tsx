import type { Metadata } from "next";
import { BadgeCheck, Inbox, Layers } from "lucide-react";
import { BarChartCard } from "@/components/dashboard/bar-chart";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { bookingsByStatus } from "@/lib/chart-data";
import { requireSession } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types/booking";
import type { Service } from "@/types/service";

export const metadata: Metadata = { title: "Overview" };

export default async function TechnicianOverviewPage() {
  const { user } = await requireSession();
  const [{ services }, { bookings }] = await Promise.all([
    serverApiFetch<{ services: Service[] }>("/api/services/mine"),
    serverApiFetch<{ bookings: Booking[] }>("/api/bookings/technician"),
  ]);

  const approved = services.filter((service) => service.approvalStatus === "approved").length;
  const servicePoints = (["pending", "approved", "rejected"] as const).map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    value: services.filter((service) => service.approvalStatus === status).length,
  }));
  const pendingRequests = bookings.filter((booking) => booking.status === "requested").length;

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Your services and incoming requests at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value={services.length} icon={Layers} />
        <StatCard label="Approved Services" value={approved} icon={BadgeCheck} />
        <StatCard label="Pending Requests" value={pendingRequests} icon={Inbox} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Requests by status" description="Every request sent to your services, grouped by where the job stands.">
          <BarChartCard valueName="Requests" data={bookingsByStatus(bookings)} />
        </ChartPanel>
        <ChartPanel title="Services by approval" description="Only approved services are shown to customers.">
          <BarChartCard valueName="Services" data={servicePoints} />
        </ChartPanel>
      </div>
    </>
  );
}
