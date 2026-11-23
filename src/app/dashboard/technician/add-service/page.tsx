import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/services/service-form";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Add Service" };

export default async function AddServicePage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader
        title="Add a service"
        description="List a repair service customers can book. It goes live once an admin approves it."
      />
      <ServiceForm technician={{ name: user.name, email: user.email }} />
    </>
  );
}
