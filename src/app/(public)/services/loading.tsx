import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceCardSkeleton } from "@/components/services/service-card";

// Shown instantly while the server loads the services.
export default function ServicesLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading services...</span>
      <div className="border-b bg-card">
        <Container className="py-12 sm:py-16">
          <div className="h-12 w-3/4 max-w-md animate-pulse rounded-lg bg-muted" />
          <div className="mt-4 h-5 w-full max-w-lg animate-pulse rounded bg-muted" />
        </Container>
      </div>
      <Section className="py-10 sm:py-12 lg:py-12">
        <div className="mb-8 h-[66px] animate-pulse rounded-xl border bg-card" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}
