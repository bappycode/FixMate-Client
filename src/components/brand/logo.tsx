import Link from "next/link";
import { Wrench } from "lucide-react";

// One fixed size on purpose: the logo must look identical on every page.
export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="FixMate home">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-5" aria-hidden />
      </span>
      <span className="font-heading text-xl font-bold tracking-tight">FixMate</span>
    </Link>
  );
}
