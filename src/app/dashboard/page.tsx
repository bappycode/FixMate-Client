import { redirect } from "next/navigation";
import { dashboardPathFor } from "@/lib/roles";
import { requireSession } from "@/lib/session";

// /dashboard itself has no content: send each user to the dashboard for their role.
export default async function DashboardIndexPage() {
  const { user } = await requireSession();
  redirect(dashboardPathFor(user.role));
}
