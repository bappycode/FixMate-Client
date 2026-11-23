import { redirect } from "next/navigation";
import { dashboardPathFor } from "@/lib/roles";
import { requireSession } from "@/lib/session";

export default async function DashboardIndexPage() {
  const { user } = await requireSession();
  redirect(dashboardPathFor(user.role));
}
