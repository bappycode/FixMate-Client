/** A payment as returned by the Express API (JSON, so ids and dates are strings). */
export type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: "usd";
  /** The Stripe payment_intent id. */
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
};

/** What a customer is shown: the technician's email is never sent to them. */
export type CustomerPayment = Omit<Payment, "technicianEmail">;
