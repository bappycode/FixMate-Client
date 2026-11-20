const wholePriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const centsPriceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** 85 -> "$85", 12.5 -> "$12.50". All FixMate prices are in USD. */
export function formatPrice(amount: number): string {
  return (Number.isInteger(amount) ? wholePriceFormatter : centsPriceFormatter).format(amount);
}

// A fixed time zone, so the server and the browser always print the same text for a date.
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-11-19T19:57:12.666Z" -> "19 Nov 2026". */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

/** "2026-11-19T19:57:12.666Z" -> "19 Nov 2026, 19:57 UTC". */
export function formatDateTime(isoDate: string): string {
  return `${dateTimeFormatter.format(new Date(isoDate))} UTC`;
}
