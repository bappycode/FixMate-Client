"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, UserPen } from "lucide-react";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardPathFor } from "@/lib/roles";
import { useSignOut } from "@/lib/use-sign-out";

type UserMenuProps = {
  user: { name: string; email: string; image?: string | null; role?: string | null };
};

export function UserMenu({ user }: UserMenuProps) {
  const signOut = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <UserAvatar name={user.name} image={user.image} size="lg" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1.5 px-2 py-2">
            <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
            <span className="truncate text-xs font-normal">{user.email}</span>
            <RoleBadge role={user.role} className="w-fit" />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={dashboardPathFor(user.role)} />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
          <UserPen />
          Update Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={signOut}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
