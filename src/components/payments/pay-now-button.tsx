"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

// Starts a payment: asks the Express server to create a Stripe Checkout Session for this booking
// (the server takes the amount from the database), then sends the browser to Stripe's payment page.
// After paying, Stripe returns the customer to /payment/success, or to /payment/cancel if they go back.
export function PayNowButton({ bookingId }: { bookingId: string }) {
  const [redirecting, setRedirecting] = useState(false);

  async function startPayment() {
    setRedirecting(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });
      window.location.assign(url); // the spinner stays until the browser leaves for Stripe
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the payment. Please try again.");
      setRedirecting(false);
    }
  }

  return (
    <Button variant="cta" size="lg" onClick={startPayment} disabled={redirecting}>
      {redirecting ? <Loader2 className="animate-spin" aria-hidden /> : <CreditCard aria-hidden />}
      Pay Now
    </Button>
  );
}
