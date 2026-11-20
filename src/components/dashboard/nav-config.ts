import {
  ClipboardList,
  CreditCard,
  Inbox,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  UserPen,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/roles";

type DashboardNavItem = { href: string; label: string; icon: LucideIcon };

const PROFILE_ITEM: DashboardNavItem = { href: "/dashboard/profile", label: "Update Profile", icon: UserPen };

const ROLE_NAV: Record<Role, DashboardNavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Requests", icon: Inbox },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Services", icon: Wrench },
    { href: "/dashboard/admin/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
  ],
};

export function navItemsFor(role: Role): DashboardNavItem[] {
  return [...ROLE_NAV[role], PROFILE_ITEM];
}
