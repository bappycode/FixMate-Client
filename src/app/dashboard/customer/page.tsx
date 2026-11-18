import type { Metadata } from "next";
import { CircleCheck, ClipboardList, Hammer } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function CustomerOverviewPage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Here is where your repair requests stand." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Requests" value="—" icon={ClipboardList} />
        <StatCard label="Active Jobs" value="—" icon={Hammer} />
        <StatCard label="Completed Jobs" value="—" icon={CircleCheck} />
      </div>
    </>
  );
}
