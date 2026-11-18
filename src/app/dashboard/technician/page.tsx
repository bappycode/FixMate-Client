import type { Metadata } from "next";
import { BadgeCheck, Inbox, Layers } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function TechnicianOverviewPage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Your services and incoming requests at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value="—" icon={Layers} />
        <StatCard label="Approved Services" value="—" icon={BadgeCheck} />
        <StatCard label="Pending Requests" value="—" icon={Inbox} />
      </div>
    </>
  );
}
