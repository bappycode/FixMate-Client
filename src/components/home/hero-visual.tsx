import { BadgeCheck, HandCoins, Smartphone } from "lucide-react";
import { JobStepper } from "@/components/shared/job-stepper";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md pb-6 lg:max-w-none lg:pb-0" aria-hidden>
      <div className="absolute inset-4 -z-10 rotate-3 rounded-[2rem] bg-tint" />

      <div className="rounded-2xl border bg-card p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3 border-b pb-5">
          <span className="flex size-11 items-center justify-center rounded-lg bg-tint text-primary">
            <Smartphone className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Example job</p>
            <p className="font-heading text-lg font-semibold">Phone screen replacement</p>
          </div>
        </div>

        <JobStepper current={2} />

        <div className="mt-5 flex items-center justify-between border-t pt-5 text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-semibold">Due after completion</span>
        </div>
      </div>

      <div className="absolute -top-3 -right-2 flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-sm font-semibold shadow-lg sm:-right-6">
        <BadgeCheck className="size-4 text-primary" /> Verified technician
      </div>
      <div className="absolute -bottom-1 -left-2 flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-sm font-semibold shadow-lg sm:-left-6 lg:bottom-8">
        <HandCoins className="size-4 text-cta" /> Pay after the job
      </div>
    </div>
  );
}
