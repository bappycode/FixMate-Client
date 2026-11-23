"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function PaymentSuccessToast({ amount }: { amount: string }) {
  useEffect(() => {
    toast.success(`Payment of ${amount} confirmed. Thank you!`, { id: "payment-success" });
  }, [amount]);

  return null;
}
