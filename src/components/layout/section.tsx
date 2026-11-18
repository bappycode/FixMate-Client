import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  /** "default" is the paper background, "white" is a white band, "tint" is a light teal band. */
  tone?: "default" | "white" | "tint";
  className?: string;
  children: React.ReactNode;
};

const TONES = {
  default: "",
  white: "bg-card",
  tint: "bg-tint/60",
} as const;

// Every home page section uses this, so vertical spacing stays identical everywhere.
export function Section({ id, tone = "default", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", TONES[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}
