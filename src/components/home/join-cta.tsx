import Link from "next/link";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";

export function JoinCta() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Are you a skilled technician?</h2>
          <p className="text-lg text-white/70">
            List your repair services on FixMate, get requests from customers near you, and manage every job in one place.
          </p>
          <Link href="/sign-up" className={buttonVariants({ variant: "cta", size: "xl" })}>
            Join as a technician
          </Link>
        </div>
      </div>
    </Section>
  );
}
