const wholePriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const centsPriceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(amount: number): string {
  return (Number.isInteger(amount) ? wholePriceFormatter : centsPriceFormatter).format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

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

export function formatDateTime(isoDate: string): string {
  return `${dateTimeFormatter.format(new Date(isoDate))} UTC`;
}
