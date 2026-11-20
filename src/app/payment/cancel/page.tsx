import type { Metadata } from "next";
import Link from "next/link";
import { PaymentResultCard } from "@/components/payments/payment-result-card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled" };

// Nothing is saved or changed when a payment is cancelled, so this page is purely informational.
export default function PaymentCancelPage() {
  return (
    <PaymentResultCard
      tone="neutral"
      title="Payment cancelled"
      description="No money was taken and your booking has not changed. You can pay whenever you are ready."
      actions={
        <Link href="/dashboard/customer/bookings" className={buttonVariants({ variant: "cta", size: "xl" })}>
          Try Again
        </Link>
      }
    />
  );
}
