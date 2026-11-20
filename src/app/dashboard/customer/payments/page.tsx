import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { CustomerPaymentsTable } from "@/components/payments/customer-payments-table";
import { serverApiFetch } from "@/lib/server-api";
import type { CustomerPayment } from "@/types/payment";

export const metadata: Metadata = { title: "Payment History" };

export default async function CustomerPaymentsPage() {
  const { payments } = await serverApiFetch<{ payments: CustomerPayment[] }>("/api/payments/my");

  return (
    <>
      <PageHeader title="Payment history" description="Every payment you have made for completed repairs." />
      <CustomerPaymentsTable payments={payments} />
    </>
  );
}
