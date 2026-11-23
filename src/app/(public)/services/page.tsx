import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageOpen, SearchX } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceFiltersBar } from "@/components/services/service-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { buttonVariants } from "@/components/ui/button";
import { getServices, type ServiceFilters } from "@/lib/services-api";

export const metadata: Metadata = { title: "Browse Services" };

const single = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);

function pageHref(filters: ServiceFilters, page: number): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }
  if (page > 1) query.set("page", String(page));
  return query.size > 0 ? `/services?${query}` : "/services";
}

export default async function ServicesPage({ searchParams }: PageProps<"/services">) {
  const params = await searchParams;
  const filters: ServiceFilters = {
    search: single(params.search),
    category: single(params.category),
    mode: single(params.mode),
    sort: single(params.sort),
  };
  const hasFilters = Object.values(filters).some(Boolean);

  const { services, total, page, pageSize } = await getServices({ ...filters, page: single(params.page) });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (services.length === 0 && total > 0) redirect(pageHref(filters, totalPages));

  return (
    <>
      <div className="border-b bg-card">
        <Container className="py-12 sm:py-16">
          <h1 className="text-4xl font-bold sm:text-5xl">Browse repair services</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Find a verified technician for your phone, laptop or home appliance.
          </p>
        </Container>
      </div>

      <Section className="py-10 sm:py-12 lg:py-12">
        <ServiceFiltersBar filters={filters} resultCount={total} />

        {services.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} hrefFor={(number) => pageHref(filters, number)} />
          </>
        ) : hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No services match your search"
            description="Try a different word, another category, or clear the filters to see everything."
            action={
              <Link href="/services" className={buttonVariants({ size: "lg" })}>
                Clear filters
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={PackageOpen}
            title="No services yet"
            description="Technicians are adding their services. Please check back soon."
          />
        )}
      </Section>
    </>
  );
}
