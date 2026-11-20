import { Loader2 } from "lucide-react";

// Shown while the server asks Stripe about the payment, so the customer sees progress instead of a blank page.
export default function PaymentSuccessLoading() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-2xl border bg-card p-10 text-center" role="status">
      <Loader2 className="size-12 animate-spin text-primary" aria-hidden />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Confirming your payment...</h1>
        <p className="text-muted-foreground">Please do not close this page. This only takes a moment.</p>
      </div>
    </div>
  );
}
