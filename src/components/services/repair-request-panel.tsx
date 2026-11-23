"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck, Clock, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";
import {
  BOOKING_LIMITS,
  todayString,
  validateAddress,
  validatePreferredDate,
  validateProblem,
  validateRequiredPhone,
} from "@/lib/booking-validation";
import { formatPrice } from "@/lib/format";
import { hasErrors, type FieldErrors } from "@/lib/validation";
import type { Booking } from "@/types/booking";

export type Viewer =
  | { kind: "guest" }
  | { kind: "blocked"; roleLabel: string }
  | { kind: "customer"; name: string; email: string; phone: string };

type Field = "customerPhone" | "address" | "preferredDate" | "problemDescription";

const validators: Record<Field, (value: string) => string | undefined> = {
  customerPhone: validateRequiredPhone,
  address: validateAddress,
  preferredDate: validatePreferredDate,
  problemDescription: validateProblem,
};

type RepairRequestPanelProps = {
  serviceId: string;
  basePrice: number;
  estimatedDuration: string;
  viewer: Viewer;
};

export function RepairRequestPanel({ serviceId, basePrice, estimatedDuration, viewer }: RepairRequestPanelProps) {
  return (
    <aside className="flex flex-col gap-5 rounded-xl border bg-card p-6 lg:sticky lg:top-24">
      <div>
        <p className="text-sm text-muted-foreground">Starting at</p>
        <p className="font-heading text-4xl font-bold">{formatPrice(basePrice)}</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden /> Usually takes {estimatedDuration}
        </p>
      </div>

      {viewer.kind === "guest" ? (
        <div className="flex flex-col gap-2">
          <Link
            href={`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`}
            className={buttonVariants({ variant: "cta", size: "xl" })}
          >
            Request Repair
          </Link>
          <p className="text-center text-sm text-muted-foreground">You will be asked to sign in first.</p>
        </div>
      ) : viewer.kind === "blocked" ? (
        <div className="flex flex-col gap-3">
          <Button variant="cta" size="xl" disabled>
            Request Repair
          </Button>
          <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            Only customers can request a repair. You are signed in as {viewer.roleLabel.toLowerCase()}.
          </p>
        </div>
      ) : (
        <RequestForm serviceId={serviceId} customer={viewer} />
      )}

      <p className="border-t pt-4 text-sm text-muted-foreground">
        You pay nothing now. Payment happens online only after the technician completes the job.
      </p>
    </aside>
  );
}

function RequestForm({ serviceId, customer }: { serviceId: string; customer: Extract<Viewer, { kind: "customer" }> }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Record<Field, string>>({
    customerPhone: customer.phone,
    address: "",
    preferredDate: "",
    problemDescription: "",
  });
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field: Field, value: string) =>
    setErrors((current) => ({ ...current, [field]: validators[field](value) }));

  const bind = (field: Field) => ({
    value: values[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      if (errors[field]) validateField(field, value);
    },
    onBlur: () => validateField(field, values[field]),
    error: errors[field],
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fields = Object.keys(validators) as Field[];
    const nextErrors: FieldErrors<Field> = Object.fromEntries(fields.map((field) => [field, validators[field](values[field])]));
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = fields.find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch<{ booking: Booking }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          customerPhone: values.customerPhone.trim(),
          address: values.address.trim(),
          preferredDate: values.preferredDate,
          problemDescription: values.problemDescription.trim(),
        }),
      });
      toast.success("Repair request sent!", {
        description: "The technician will review it soon.",
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-3 rounded-lg bg-tint p-4" role="status">
        <p className="flex items-center gap-2 font-semibold text-primary">
          <CircleCheck className="size-5" aria-hidden /> Request sent
        </p>
        <p className="text-sm text-muted-foreground">Follow its progress from your bookings.</p>
        <Link href="/dashboard/customer/bookings" className={buttonVariants({ size: "lg" })}>
          View My Bookings
        </Link>
      </div>
    );
  }

  if (!open) {
    return (
      <Button variant="cta" size="xl" onClick={() => setOpen(true)}>
        Request Repair
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField id="customerName" label="Name" value={customer.name} disabled readOnly />
      <FormField id="customerEmail" label="Email" value={customer.email} disabled readOnly />
      <FormField id="customerPhone" label="Phone" type="tel" autoComplete="tel" placeholder="+880 1700-123456" {...bind("customerPhone")} />
      <FormField id="address" label="Address" autoComplete="street-address" placeholder="House, road, area" {...bind("address")} />
      <FormField id="preferredDate" label="Preferred date" type="date" min={todayString()} {...bind("preferredDate")} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="problemDescription">What is wrong?</Label>
        <Textarea
          id="problemDescription"
          name="problemDescription"
          rows={4}
          placeholder="Describe the problem, e.g. when it started and what you have tried."
          aria-invalid={errors.problemDescription ? true : undefined}
          aria-describedby={errors.problemDescription ? "problemDescription-error" : undefined}
          value={values.problemDescription}
          onChange={bind("problemDescription").onChange}
          onBlur={bind("problemDescription").onBlur}
        />
        <div className="flex justify-between gap-3 text-sm">
          <p id="problemDescription-error" role={errors.problemDescription ? "alert" : undefined} className="text-destructive">
            {errors.problemDescription}
          </p>
          <span className="ml-auto text-muted-foreground">
            {values.problemDescription.trim().length}/{BOOKING_LIMITS.problemMax}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="xl" onClick={() => setOpen(false)} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="cta" size="xl" disabled={submitting} className="flex-1">
          {submitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {submitting ? "Sending..." : "Send request"}
        </Button>
      </div>
    </form>
  );
}
