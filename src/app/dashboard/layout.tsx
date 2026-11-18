import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isRole } from "@/lib/roles";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s | FixMate Dashboard" } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireSession();
  const role = isRole(user.role) ? user.role : "customer";

  return (
    <DashboardShell role={role} initialUser={{ name: user.name, email: user.email, image: user.image, role }}>
      {children}
    </DashboardShell>
  );
}
