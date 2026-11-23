import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Update Profile" };

export default async function ProfilePage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader
        title="Update profile"
        description="Keep your details current. Your name and photo appear across FixMate."
      />
      <ProfileForm
        user={{
          email: user.email,
          role: user.role ?? "customer",
          image: user.image ?? null,
          name: user.name,
          phone: user.phone ?? "",
          area: user.area ?? "",
          bio: user.bio ?? "",
        }}
      />
    </>
  );
}
