import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Optional right-aligned slot, e.g. a "View all" link. */
  action?: React.ReactNode;
};

// One heading style for every section (same font, size and color), as the design rules require.
export function SectionHeading({ eyebrow, title, description, align = "left", action }: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", centered && "justify-center text-center")}>
      <div className={cn("flex max-w-2xl flex-col gap-3", centered && "items-center")}>
        {eyebrow ? <p className="text-sm font-semibold tracking-wider text-primary uppercase">{eyebrow}</p> : null}
        <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
        {description ? <p className="text-lg text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
