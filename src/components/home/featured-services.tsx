import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/services/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getLatestServices } from "@/lib/services-api";

const GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

export async function FeaturedServices() {
  const services = await getLatestServices(6);

  if (services.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="New services are on the way"
        description="Technicians are adding their repair services. Browse what is available, or check back soon."
        action={
          <Link href="/services" className={buttonVariants({ size: "lg" })}>
            Browse services
          </Link>
        }
      />
    );
  }

  return (
    <div className={GRID}>
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

export function FeaturedServicesSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 6 }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
}
