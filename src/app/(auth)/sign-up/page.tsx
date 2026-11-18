import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { redirectIfAuthenticated } from "@/lib/session";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  await redirectIfAuthenticated();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">Join FixMate as a customer or a technician.</p>
      </div>
      <SignUpForm />
    </div>
  );
}
