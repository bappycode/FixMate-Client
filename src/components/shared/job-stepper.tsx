import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const JOB_STEPS = ["Requested", "Accepted", "In Progress", "Completed", "Paid"] as const;

type JobStepperProps = {
  /** Index into JOB_STEPS of the step the job is currently at. */
  current: number;
  /** Use "dark" when the stepper sits on the ink background. */
  tone?: "light" | "dark";
};

export function JobStepper({ current, tone = "light" }: JobStepperProps) {
  const dark = tone === "dark";

  return (
    <ol className="flex flex-col">
      {JOB_STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        const last = index === JOB_STEPS.length - 1;

        return (
          <li key={label} className="relative flex gap-3 pb-5 last:pb-0" aria-current={active ? "step" : undefined}>
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-7 left-[13px] h-[calc(100%-1.75rem)] w-px",
                  done ? "bg-primary" : dark ? "bg-white/15" : "bg-border",
                )}
              />
            ) : null}
            <span
              aria-hidden
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-primary/15 text-primary ring-4 ring-primary/20",
                !done && !active && (dark ? "border-white/20 text-white/50" : "border-border text-muted-foreground"),
              )}
            >
              {done ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "pt-0.5 text-sm",
                active ? "font-semibold" : "font-medium",
                !done && !active && (dark ? "text-white/50" : "text-muted-foreground"),
                dark && (done || active) && "text-white",
              )}
            >
              {label}
              <span className="sr-only">{done ? " (done)" : active ? " (current step)" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
