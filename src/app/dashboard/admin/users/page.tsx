import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { UsersTable } from "@/components/admin/users-table";
import { requireSession } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import type { AdminUser } from "@/types/user";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  const { user } = await requireSession();
  const { users } = await serverApiFetch<{ users: AdminUser[] }>("/api/admin/users");

  return (
    <>
      <PageHeader
        title="Manage users"
        description="See everyone on FixMate and change roles. You cannot change your own role."
      />
      <UsersTable initialUsers={users} currentUserId={user.id} />
    </>
  );
}
