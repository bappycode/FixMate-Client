import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedServices, FeaturedServicesSkeleton } from "@/components/home/featured-services";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { JoinCta } from "@/components/home/join-cta";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section id="featured">
        <SectionHeading
          eyebrow="Featured services"
          title="Latest repair services"
          description="Freshly approved services from verified technicians."
          action={
            <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
              View all services <ArrowRight aria-hidden />
            </Link>
          }
        />
        {/* The skeleton shows instantly while the services load from the API. */}
        <Suspense fallback={<FeaturedServicesSkeleton />}>
          <FeaturedServices />
        </Suspense>
      </Section>

      <HowItWorks />
      <CategoriesSection />
      <WhyChooseUs />
      <JoinCta />
    </>
  );
}
