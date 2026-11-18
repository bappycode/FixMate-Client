const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** 85 -> "$85". All FixMate prices are in USD. */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}
