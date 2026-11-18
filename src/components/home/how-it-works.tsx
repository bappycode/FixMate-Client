import { ArrowRight, ClipboardPen, CreditCard, Search, Wrench } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  { icon: Search, title: "Find a service", description: "Search approved services by category, price and area." },
  { icon: ClipboardPen, title: "Send a request", description: "Describe the problem, pick a date and send it to the technician." },
  { icon: Wrench, title: "Technician fixes it", description: "Follow the job from accepted, to in progress, to completed." },
  { icon: CreditCard, title: "Pay after completion", description: "Pay securely online only once the work is delivered." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="white">
      <SectionHeading
        align="center"
        eyebrow="How FixMate works"
        title="From broken to fixed in four steps"
        description="No chasing, no guessing. You always know where your repair stands."
      />

      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <li key={title} className="relative flex flex-col gap-4 rounded-xl border bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="font-heading text-3xl font-bold text-border" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-xl font-semibold">
              <span className="sr-only">Step {index + 1}: </span>
              {title}
            </h3>
            <p className="text-muted-foreground">{description}</p>

            {index < STEPS.length - 1 ? (
              <ArrowRight className="absolute top-1/2 -right-[19px] z-10 hidden size-8 -translate-y-1/2 rounded-full border bg-card p-1.5 text-primary lg:block" aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
