"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { dashboardPathFor, type SignUpRole } from "@/lib/roles";
import { hasErrors, validateEmail, validateName, validateNewPassword, type FieldErrors } from "@/lib/validation";
import { FormField } from "./form-field";
import { RolePicker } from "./role-picker";

type Field = "name" | "email" | "password";

const validators: Record<Field, (value: string) => string | undefined> = {
  name: validateName,
  email: validateEmail,
  password: validateNewPassword,
};

export function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState<SignUpRole>("customer");
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field: Field, value: string) =>
    setErrors((current) => ({ ...current, [field]: validators[field](value) }));

  const handleChange = (field: Field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    // Once a field has shown an error, re-check it as the user types.
    if (errors[field]) validateField(field, value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors<Field> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validateNewPassword(values.password),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = (Object.keys(nextErrors) as Field[]).find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role,
    });
    setSubmitting(false);

    if (error || !data) {
      toast.error(error?.message ?? "Could not create your account. Please try again.");
      return;
    }

    toast.success("Account created. Welcome to FixMate!");
    router.push(dashboardPathFor(data.user.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField
        id="name"
        label="Full name"
        autoComplete="name"
        placeholder="Your full name"
        value={values.name}
        onChange={handleChange("name")}
        onBlur={() => validateField("name", values.name)}
        error={errors.name}
      />
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
        autoComplete="new-password"
        placeholder="At least 6 characters"
        value={values.password}
        onChange={handleChange("password")}
        onBlur={() => validateField("password", values.password)}
        error={errors.password}
      />
      <RolePicker value={role} onChange={setRole} />

      <Button type="submit" disabled={submitting} className="h-11 w-full text-sm">
        {submitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {submitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
