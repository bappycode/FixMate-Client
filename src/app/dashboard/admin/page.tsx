import type { Metadata } from "next";
import { Hourglass, Users, Wrench } from "lucide-react";
import { BarChartCard } from "@/components/dashboard/bar-chart";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { STATUS_STYLES } from "@/components/shared/booking-badges";
import { STATUS_ORDER, formatMonth, type ChartPoint } from "@/lib/chart-data";
import { requireSession } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import type { BookingStatus } from "@/types/booking";
import type { Role } from "@/lib/roles";

export const metadata: Metadata = { title: "Overview" };

type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  bookingsByStatus: { status: BookingStatus; count: number }[];
  usersByRole: { role: Role; count: number }[];
  revenueByMonth: { month: string; total: number }[];
};

const ROLE_LABELS: Record<Role, string> = { customer: "Customers", technician: "Technicians", admin: "Admins" };

export default async function AdminOverviewPage() {
  const { user } = await requireSession();
  const stats = await serverApiFetch<AdminStats>("/api/admin/stats");

  // The server counts every status; the chart shows them in the order a job moves through them.
  const bookingPoints: ChartPoint[] = STATUS_ORDER.map((status) => ({
    label: STATUS_STYLES[status].label,
    value: stats.bookingsByStatus.find((item) => item.status === status)?.count ?? 0,
  }));
  const rolePoints: ChartPoint[] = stats.usersByRole.map(({ role, count }) => ({ label: ROLE_LABELS[role], value: count }));
  const revenuePoints: ChartPoint[] = stats.revenueByMonth.map(({ month, total }) => ({ label: formatMonth(month), value: total }));

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Platform activity and items waiting for review." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Total Technicians" value={stats.totalTechnicians} icon={Wrench} />
        <StatCard label="Pending Services" value={stats.pendingServices} icon={Hourglass} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Revenue by month" description="Payments received in the last six months, in US dollars.">
          <BarChartCard valueName="Revenue" data={revenuePoints} unit="money" />
        </ChartPanel>
        <ChartPanel title="Bookings by status" description="Every booking on the platform, grouped by where the job stands.">
          <BarChartCard valueName="Bookings" data={bookingPoints} />
        </ChartPanel>
        <ChartPanel title="Users by role" description="How many accounts each role has.">
          <BarChartCard valueName="Users" data={rolePoints} />
        </ChartPanel>
      </div>
    </>
  );
}
