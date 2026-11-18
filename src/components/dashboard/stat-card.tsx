import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-5">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-heading text-3xl font-bold tracking-tight">{value}</p>
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-tint text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
    </div>
  );
}
