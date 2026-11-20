"use client";

import { ErrorState } from "@/components/shared/error-state";

// A failure inside the dashboard keeps the sidebar and top bar around it.
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState error={error} reset={reset} href="/dashboard" linkLabel="Back to Dashboard" />;
}
