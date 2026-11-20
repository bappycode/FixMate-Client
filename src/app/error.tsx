"use client";

import { Logo } from "@/components/brand/logo";
import { ErrorState } from "@/components/shared/error-state";

// The error boundary for the whole site: a failed page shows this instead of a blank screen.
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <header className="border-b px-4 py-4 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center">
        <ErrorState error={error} reset={reset} href="/" linkLabel="Back to Home" />
      </main>
    </>
  );
}
