import { NotFoundState } from "@/components/shared/not-found-state";

// A missing page or record inside the dashboard keeps the sidebar and top bar around it.
export default function DashboardNotFound() {
  return <NotFoundState href="/dashboard" linkLabel="Back to Dashboard" />;
}
