import type { Metadata } from "next";
import Link from "next/link";
import { PaymentResultCard } from "@/components/payments/payment-result-card";
import { PaymentSuccessToast } from "@/components/payments/payment-success-toast";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/format";
import { serverApiFetchSafe } from "@/lib/server-api";
import type { CustomerPayment } from "@/types/payment";

export const metadata: Metadata = { title: "Payment" };

type VerifyResponse = { payment: CustomerPayment; alreadyProcessed: boolean };

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs break-all" : "text-right font-medium"}>{value}</dd>
    </div>
  );
}

export default async function PaymentSuccessPage({ searchParams }: PageProps<"/payment/success">) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  const bookings = (
    <Link href="/dashboard/customer/bookings" className={buttonVariants({ size: "xl" })}>
      My Bookings
    </Link>
  );

  if (!sessionId) {
    return (
      <PaymentResultCard
        tone="error"
        title="No payment to confirm"
        description="This page needs a payment session from Stripe. Start from your bookings and use Pay Now."
        actions={bookings}
      />
    );
  }

  const result = await serverApiFetchSafe<VerifyResponse>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`);

  if (!result.ok) {
    return (
      <PaymentResultCard
        tone="error"
        title="We could not confirm your payment"
        description={`${result.message}. If money was taken from your card, it will be matched to your booking shortly, or contact support.`}
        actions={bookings}
      />
    );
  }

  const { payment } = result.data;
  const amount = formatPrice(payment.amount);

  return (
    <>
      <PaymentSuccessToast amount={amount} />
      <PaymentResultCard
        tone="success"
        title="Payment successful"
        description={`Thank you! You paid ${amount} and your booking is now marked as paid.`}
        actions={
          <>
            {bookings}
            <Link href="/dashboard/customer/payments" className={buttonVariants({ variant: "outline", size: "xl" })}>
              Payment History
            </Link>
          </>
        }
      >
        <dl className="w-full divide-y rounded-xl border bg-background px-5 text-left text-sm">
          <Row label="Service" value={payment.serviceTitle} />
          <Row label="Technician" value={payment.technicianName} />
          <Row label="Amount paid" value={amount} />
          <Row label="Paid on" value={formatDate(payment.paidAt)} />
          <Row label="Transaction ID" value={payment.transactionId} mono />
        </dl>
      </PaymentResultCard>
    </>
  );
}
