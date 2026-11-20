import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { MyServicesTable } from "@/components/services/my-services-table";
import { buttonVariants } from "@/components/ui/button";
import { serverApiFetch } from "@/lib/server-api";
import type { Service } from "@/types/service";

export const metadata: Metadata = { title: "My Services" };

export default async function MyServicesPage() {
  const { services } = await serverApiFetch<{ services: Service[] }>("/api/services/mine");

  return (
    <>
      <PageHeader
        title="My services"
        description="Edit, switch on or off, or delete the services you offer."
        action={
          <Link href="/dashboard/technician/add-service" className={buttonVariants({ size: "lg" })}>
            <PlusCircle aria-hidden /> Add service
          </Link>
        }
      />
      <MyServicesTable initialServices={services} />
    </>
  );
}
