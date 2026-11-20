import Link from "next/link";
import { Hammer, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type NotFoundStateProps = {
  href: string;
  linkLabel: string;
};

// The 404 content, shared by the public site and the dashboard.
export function NotFoundState({ href, linkLabel }: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
      {/* A wrench and a hammer crossed over the "0" of 404: the repair-shop version of a dead end. */}
      <div className="flex items-center gap-2 font-heading text-8xl leading-none font-bold text-foreground sm:text-9xl" aria-hidden>
        <span>4</span>
        <span className="relative flex size-24 items-center justify-center rounded-full bg-tint text-primary sm:size-32">
          <Wrench className="absolute size-14 rotate-45 sm:size-20" />
          <Hammer className="absolute size-14 -rotate-45 sm:size-20" />
        </span>
        <span>4</span>
      </div>

      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-3xl font-bold">This page is out of order</h1>
        <p className="text-muted-foreground">
          We could not find what you were looking for. It may have been moved, removed, or the link is wrong.
        </p>
      </div>

      <Link href={href} className={buttonVariants({ variant: "cta", size: "xl" })}>
        {linkLabel}
      </Link>
    </div>
  );
}
