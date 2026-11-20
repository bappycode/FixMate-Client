import { CircleCheck, CircleX, Undo2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES: Record<"success" | "error" | "neutral", { icon: LucideIcon; ring: string }> = {
  success: { icon: CircleCheck, ring: "bg-green-100 text-green-700" },
  error: { icon: CircleX, ring: "bg-red-100 text-red-700" },
  neutral: { icon: Undo2, ring: "bg-muted text-muted-foreground" },
};

type PaymentResultCardProps = {
  tone: keyof typeof TONES;
  title: string;
  description: string;
  /** Extra content, such as the receipt details. */
  children?: React.ReactNode;
  /** Buttons shown under the content. */
  actions?: React.ReactNode;
};

// The card used by the payment success, failure and cancelled pages.
export function PaymentResultCard({ tone, title, description, children, actions }: PaymentResultCardProps) {
  const { icon: Icon, ring } = TONES[tone];

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
      <span className={cn("flex size-20 items-center justify-center rounded-full", ring)}>
        <Icon className="size-10" aria-hidden />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
      {actions ? <div className="flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </div>
  );
}
