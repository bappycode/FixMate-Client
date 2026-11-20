import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/services/service-form";
import { requireSession } from "@/lib/session";
import { serverApiFetchOrNull } from "@/lib/server-api";
import type { Service } from "@/types/service";

export const metadata: Metadata = { title: "Edit Service" };

export default async function EditServicePage({ params }: PageProps<"/dashboard/technician/my-services/[id]/edit">) {
  const { id } = await params;
  const { user } = await requireSession();

  // The API only returns the service if it belongs to this technician; anything else is a 404.
  const data = await serverApiFetchOrNull<{ service: Service }>(`/api/services/mine/${id}`);
  if (!data) notFound();

  return (
    <>
      <PageHeader
        title="Edit service"
        description="Update the details below. An admin will review the changes before the service is public again."
      />
      <ServiceForm technician={{ name: user.name, email: user.email }} service={data.service} />
    </>
  );
}
