"use client";

import { useState } from "react";
import Link from "next/link";
import { House, Menu } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import { RoleBadge } from "@/components/shared/role-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import type { Role } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";

type ShellUser = { name: string; email: string; image?: string | null; role?: string | null };

type DashboardShellProps = {
  role: Role;
  initialUser: ShellUser;
  children: React.ReactNode;
};

export function DashboardShell({ role, initialUser, children }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user: ShellUser = session?.user ?? initialUser;

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:block">
        <SidebarNav role={role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6 lg:px-8">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon-lg" aria-label="Open sidebar" className="lg:hidden" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false} className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
              <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
              <SheetDescription className="sr-only">Navigation for your {role} dashboard</SheetDescription>
              <SidebarNav role={role} onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "h-9 gap-2 px-3 text-muted-foreground")}>
            <House className="size-4" aria-hidden />
            <span className="hidden sm:inline">Back to home</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden min-w-0 flex-col items-end sm:flex">
              <span className="max-w-48 truncate text-sm font-semibold">{user.name}</span>
              <RoleBadge role={user.role} />
            </div>
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
