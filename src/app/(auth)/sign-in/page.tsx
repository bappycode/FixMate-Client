import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSafeRedirect, REDIRECT_PARAM } from "@/lib/safe-redirect";
import { redirectIfAuthenticated } from "@/lib/session";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  await redirectIfAuthenticated();
  const params = await searchParams;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to track your repairs and manage your jobs.</p>
      </div>
      <SignInForm redirectTo={getSafeRedirect(params[REDIRECT_PARAM])} />
    </div>
  );
}
