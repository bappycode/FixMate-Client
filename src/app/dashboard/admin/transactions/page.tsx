import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionsTable } from "@/components/admin/transactions-table";
import { formatPrice } from "@/lib/format";
import { serverApiFetch } from "@/lib/server-api";
import type { Payment } from "@/types/payment";

export const metadata: Metadata = { title: "Transactions" };

export default async function AdminTransactionsPage() {
  const { payments, totalRevenue } = await serverApiFetch<{ payments: Payment[]; totalRevenue: number }>(
    "/api/admin/payments",
  );

  return (
    <>
      <PageHeader title="Transactions" description="Every payment made on the platform." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={Wallet} />
      </div>
      <TransactionsTable payments={payments} />
    </>
  );
}
