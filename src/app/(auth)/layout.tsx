import { Logo } from "@/components/brand/logo";
import { JobStepper } from "@/components/shared/job-stepper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid flex-1 lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-center overflow-hidden bg-ink p-12 text-white lg:flex xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative mx-auto flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold tracking-wide text-primary-foreground/70 uppercase">
              Pay after the job is done
            </p>
            <h2 className="text-4xl leading-tight font-bold">Follow every repair, one clear step at a time.</h2>
            <p className="text-base text-white/70">
              Send a request, watch your technician move the job forward, and pay only once the work is delivered.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <JobStepper current={2} tone="dark" />
          </div>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="px-4 py-5 sm:px-8">
          <Logo />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
