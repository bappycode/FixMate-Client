"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS, ROLES, type Role } from "@/lib/roles";
import type { AdminUser } from "@/types/user";

type UsersTableProps = {
  initialUsers: AdminUser[];
  currentUserId: string;
};

export function UsersTable({ initialUsers, currentUserId }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [change, setChange] = useState<{ user: AdminUser; role: Role } | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirmChange() {
    if (!change) return;
    setSaving(true);
    try {
      const { user: updated } = await apiFetch<{ user: AdminUser }>(`/api/admin/users/${change.user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: change.role }),
      });
      setUsers((list) => list.map((item) => (item._id === updated._id ? updated : item)));
      toast.success(`${change.user.name} is now ${ROLE_LABELS[change.role].toLowerCase()}.`);
      setChange(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change the role.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="pr-4">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isYou = user._id === currentUserId;
              return (
                <TableRow key={user._id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} image={user.image} />
                      <span className="font-medium">
                        {user.name}
                        {isYou ? <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span> : null}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {isYou ? (
                      <RoleBadge role={user.role} />
                    ) : (
                      <select
                        aria-label={`Role of ${user.name}`}
                        value={user.role}
                        onChange={(event) => setChange({ user, role: event.target.value as Role })}
                        className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                    )}
                  </TableCell>
                  <TableCell className="pr-4 whitespace-nowrap">{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={change !== null}
        onOpenChange={(open) => {
          if (!open) setChange(null);
        }}
        title="Change this user's role?"
        description={
          change
            ? `${change.user.name} will change from ${ROLE_LABELS[change.user.role]} to ${ROLE_LABELS[change.role]}. It takes effect immediately.${
                change.role === "admin" ? " Admins can manage every user, service and booking." : ""
              }`
            : ""
        }
        confirmLabel="Change role"
        destructive={change?.role === "admin"}
        pending={saving}
        onConfirm={confirmChange}
      />
    </>
  );
}
