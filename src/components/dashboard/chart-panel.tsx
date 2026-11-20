type ChartPanelProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

// The white box every dashboard chart sits in, matching the stat cards.
export function ChartPanel({ title, description, children }: ChartPanelProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
