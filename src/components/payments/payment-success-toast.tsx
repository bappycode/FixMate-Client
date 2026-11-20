"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// The success page confirms the payment on the server, then renders this to show the toast.
// A fixed id means the toast appears once, even if React runs the effect twice in development.
export function PaymentSuccessToast({ amount }: { amount: string }) {
  useEffect(() => {
    toast.success(`Payment of ${amount} confirmed. Thank you!`, { id: "payment-success" });
  }, [amount]);

  return null;
}
