import { Container } from "@/components/layout/container";

// Shown instantly while the server loads the service.
export default function ServiceDetailsLoading() {
  return (
    <Container className="py-8 sm:py-12" aria-busy="true">
      <span className="sr-only">Loading service...</span>
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[74px] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    </Container>
  );
}
