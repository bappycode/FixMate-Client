import type { Metadata } from "next";
import { Hourglass, Users, Wrench } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Platform activity and items waiting for review." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value="—" icon={Users} />
        <StatCard label="Total Technicians" value="—" icon={Wrench} />
        <StatCard label="Pending Services" value="—" icon={Hourglass} />
      </div>
    </>
  );
}
