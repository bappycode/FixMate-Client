import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServicesApprovalTable } from "@/components/admin/services-approval-table";
import { serverApiFetch } from "@/lib/server-api";
import type { Service } from "@/types/service";

export const metadata: Metadata = { title: "Service Approval" };

export default async function AdminServicesPage() {
  const { services } = await serverApiFetch<{ services: Service[] }>("/api/admin/services");

  return (
    <>
      <PageHeader
        title="Service approval"
        description="Review services from technicians. Only approved services appear on the public site."
      />
      <ServicesApprovalTable initialServices={services} />
    </>
  );
}
