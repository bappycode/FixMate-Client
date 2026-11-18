import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { categoryHref, CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { HeroVisual } from "./hero-visual";

// Chips under the search box link straight to a filtered services page.
const QUICK_CATEGORIES = CATEGORIES.slice(0, 4);

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[32rem] rounded-full bg-primary/10 blur-3xl" />

      <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-28">
        <div className="flex flex-col gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            Verified technicians. Pay after the job.
          </p>

          <h1 className="text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl">
            Broken device? Get it fixed by <span className="text-primary">verified technicians.</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Book a repair for your phone, laptop or home appliance, follow every step of the job, and pay only once
            the work is done.
          </p>

          {/* A plain GET form: it works without JavaScript and lands on /services?search=... */}
          <form
            action="/services"
            method="get"
            role="search"
            className="flex w-full max-w-xl flex-col gap-2 rounded-xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/40 sm:flex-row"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search repair services
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                id="hero-search"
                name="search"
                type="search"
                placeholder="Try “iPhone screen” or “AC servicing”"
                className="h-11 w-full rounded-lg bg-transparent pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button type="submit" className={cn(buttonVariants({ variant: "cta", size: "xl" }))}>
              Find a technician
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {QUICK_CATEGORIES.map(({ name }) => (
              <Link
                key={name}
                href={categoryHref(name)}
                className="rounded-full border bg-card px-3 py-1 font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
