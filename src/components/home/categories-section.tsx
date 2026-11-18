import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { categoryHref, CATEGORIES } from "@/lib/categories";

const CARD =
  "group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0";

// Each card links to /services?category=<name>, which opens the browse page already filtered.
export function CategoriesSection() {
  return (
    <Section id="categories">
      <SectionHeading
        eyebrow="Popular categories"
        title="What needs fixing?"
        description="Pick a category to see the technicians who repair it."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map(({ name, icon: Icon, blurb }) => (
          <Link key={name} href={categoryHref(name)} className={CARD}>
            <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-6" aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{blurb}</p>
            </div>
            <ArrowRight className="mt-auto size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        ))}

        {/* An eighth card keeps the grid even and gives a way to see everything. */}
        <Link href="/services" className={`${CARD} border-dashed bg-transparent`}>
          <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-white">
            <LayoutGrid className="size-6" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">All services</h3>
            <p className="text-sm text-muted-foreground">Browse every approved repair service</p>
          </div>
          <ArrowRight className="mt-auto size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
