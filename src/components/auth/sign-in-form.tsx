"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { dashboardPathFor } from "@/lib/roles";
import { hasErrors, validateEmail, validatePasswordPresent, type FieldErrors } from "@/lib/validation";
import { FormField } from "./form-field";

type Field = "email" | "password";

const validators: Record<Field, (value: string) => string | undefined> = {
  email: validateEmail,
  password: validatePasswordPresent,
};

type SignInFormProps = {
  /** A same-site path the user was trying to open before being sent here. */
  redirectTo: string | null;
};

export function SignInForm({ redirectTo }: SignInFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field: Field, value: string) =>
    setErrors((current) => ({ ...current, [field]: validators[field](value) }));

  const handleChange = (field: Field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) validateField(field, value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors<Field> = {
      email: validateEmail(values.email),
      password: validatePasswordPresent(values.password),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = (Object.keys(nextErrors) as Field[]).find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    const { data, error } = await authClient.signIn.email({
      email: values.email.trim(),
      password: values.password,
    });
    setSubmitting(false);

    if (error || !data) {
      toast.error(error?.message ?? "Could not sign you in. Please try again.");
      return;
    }

    toast.success("Welcome back!");
    router.push(redirectTo ?? dashboardPathFor(data.user.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        onChange={handleChange("email")}
        onBlur={() => validateField("email", values.email)}
        error={errors.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        value={values.password}
        onChange={handleChange("password")}
        onBlur={() => validateField("password", values.password)}
        error={errors.password}
      />

      <Button type="submit" disabled={submitting} className="h-11 w-full text-sm">
        {submitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {submitting ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to FixMate?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
