import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardPen, CreditCard, Search, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description: `How ${SITE.name} connects customers with verified repair technicians, from the first request to the final payment.`,
};

const JOURNEY = [
  { icon: Search, title: "Find a service", description: "Browse approved services and filter by category, service mode and price." },
  { icon: ClipboardPen, title: "Send a request", description: "Tell the technician what is wrong, where to come, and when you are free." },
  { icon: Wrench, title: "Follow the job", description: "The technician accepts, starts and completes the job. Each step is recorded with its time." },
  { icon: CreditCard, title: "Pay securely", description: "When the job is completed and the final amount is set, you pay online with Stripe." },
];

const ROLES = [
  {
    icon: UserRound,
    title: "Customers",
    points: ["Search and compare repair services", "Request a repair and follow its progress", "Cancel a request before it is accepted", "Pay online only after the job is completed"],
  },
  {
    icon: Wrench,
    title: "Technicians",
    points: ["List repair services with photos and prices", "Accept or reject incoming requests", "Move each job from accepted to completed", "Set the final amount when the work is done"],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    points: ["Approve or reject every new service", "Manage user accounts and roles", "See every booking on the platform", "Track all payments and total revenue"],
  },
];

const FAQS = [
  {
    question: "When am I charged?",
    answer: "Only after the technician marks the job as completed and sets the final amount. Sending a request is free.",
  },
  {
    question: "Is my card information safe?",
    answer: `Payments are handled on Stripe's own secure checkout page. ${SITE.name} never sees or stores your card details.`,
  },
  {
    question: "Can I cancel a request?",
    answer: "Yes, as long as the technician has not accepted it yet. After that, please contact the technician directly.",
  },
  {
    question: "Why do services need approval?",
    answer: "An admin reviews every new service before it appears on the site, so customers only see real, complete listings.",
  },
  {
    question: "Does the final price match the listed price?",
    answer: "The listed price is a starting price. The technician sets the final amount when the job is completed, and you see it before you pay.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="border-b bg-card">
        <Container className="py-12 sm:py-16">
          <h1 className="text-4xl font-bold sm:text-5xl">How {SITE.name} works</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {SITE.name} connects customers with verified repair technicians, and keeps every job visible from the first request to the final payment.
          </p>
        </Container>
      </div>

      <Section tone="white">
        <SectionHeading
          eyebrow="The journey"
          title="Four steps from broken to fixed"
          description="You always know where your repair stands."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="flex flex-col gap-4 rounded-xl border bg-background p-6">
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
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Who it is for"
          title="One platform, three roles"
          description="Everyone sees the part of FixMate that fits their job."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {ROLES.map(({ icon: Icon, title, points }) => (
            <article key={title} className="flex flex-col gap-4 rounded-xl border bg-card p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <ul className="flex flex-col gap-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading align="center" eyebrow="Questions" title="Good to know" />
        <dl className="mx-auto grid max-w-3xl gap-4">
          {FAQS.map(({ question, answer }) => (
            <div key={question} className="rounded-xl border bg-card p-6">
              <dt className="text-lg font-semibold">{question}</dt>
              <dd className="mt-2 text-muted-foreground">{answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to get something fixed?</h2>
          <p className="max-w-xl text-lg text-muted-foreground">Browse the approved services, or create a free account to send your first request.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/services" className={buttonVariants({ variant: "cta", size: "xl" })}>
              Browse services
            </Link>
            <Link href="/sign-up" className={buttonVariants({ variant: "outline", size: "xl" })}>
              Create an account
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
