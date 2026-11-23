"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

type ErrorStateProps = {
  error: Error & { digest?: string };
  reset: () => void;
  href: string;
  linkLabel: string;
};

export function ErrorState({ error, reset, href, linkLabel }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-16 text-center sm:py-24" role="alert">
      <span className="flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-10" aria-hidden />
      </span>

      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We hit a problem loading this page. Please try again. If it keeps happening, come back in a few minutes.
        </p>
        {error.digest ? <p className="text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="xl" onClick={reset}>
          <RotateCcw aria-hidden /> Try again
        </Button>
        <Link href={href} className={buttonVariants({ variant: "outline", size: "xl" })}>
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
