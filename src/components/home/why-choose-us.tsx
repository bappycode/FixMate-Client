import Link from "next/link";
import { BadgeCheck, Eye, HandCoins, Receipt } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";

const POINTS = [
  { icon: BadgeCheck, title: "Verified technicians", description: "Every service is reviewed and approved by an admin before it goes live." },
  { icon: HandCoins, title: "Pay after service", description: "You are charged only after the technician marks the job completed." },
  { icon: Eye, title: "Track every job", description: "A clear status at every stage, so you never wonder what is happening." },
  { icon: Receipt, title: "Clear pricing", description: "See the starting price up front, and the final amount before you pay." },
];

export function WhyChooseUs() {
  return (
    <Section id="why-fixmate" tone="tint">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            eyebrow="Why FixMate"
            title="Repairs you can trust"
            description="We built FixMate around the two things that go wrong with repairs: not knowing what is happening, and paying before the work is done."
          />
          <Link href="/sign-up" className={buttonVariants({ variant: "cta", size: "xl" })}>
            Create a free account
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {POINTS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex flex-col gap-3 rounded-xl border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-lg bg-tint text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
