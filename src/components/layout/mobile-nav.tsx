"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserPen } from "lucide-react";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { dashboardPathFor } from "@/lib/roles";
import { useSignOut } from "@/lib/use-sign-out";
import { cn } from "@/lib/utils";
import { isActiveLink, PUBLIC_NAV_LINKS } from "./nav-links";

type MobileNavProps = {
  user: { name: string; email: string; image?: string | null; role?: string | null } | null;
  isPending: boolean;
};

const rowClass = "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted";

export function MobileNav({ user, isPending }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const signOut = useSignOut();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" aria-label="Open menu" className="md:hidden" />}>
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation and account links</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={isActiveLink(pathname, link.href) ? "page" : undefined}
              className={cn(rowClass, isActiveLink(pathname, link.href) && "bg-tint text-primary")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-2 border-t px-4 pt-4">
          {isPending ? null : user ? (
            <div className="flex flex-col gap-1">
              <div className="mb-2 flex items-center gap-3 px-3">
                <UserAvatar name={user.name} image={user.image} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <RoleBadge role={user.role} className="mt-1" />
                </div>
              </div>
              <Link href={dashboardPathFor(user.role)} onClick={close} className={rowClass}>
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
              <Link href="/dashboard/profile" onClick={close} className={rowClass}>
                <UserPen className="size-4" /> Update Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  close();
                  void signOut();
                }}
                className={cn(rowClass, "text-destructive")}
              >
                <LogOut className="size-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/sign-in" onClick={close} className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
                Sign In
              </Link>
              <Link href="/sign-up" onClick={close} className={cn(buttonVariants(), "h-10")}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
