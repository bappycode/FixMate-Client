"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { navItemsFor } from "./nav-config";

type SidebarNavProps = {
  role: Role;
  onNavigate?: () => void;
};

export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const items = navItemsFor(role);
  const overviewHref = `/dashboard/${role}`;

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-1">
        <Logo />
      </div>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
          {ROLE_LABELS[role]} workspace
        </p>
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === overviewHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-white shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
              )}
            >
              <Icon className="size-4.5 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
