"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();

  return async function signOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Could not sign out. Please try again.");
      return;
    }
    toast.success("You have been signed out.");
    router.push("/");
    router.refresh();
  };
}
