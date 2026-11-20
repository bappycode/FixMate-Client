// Validators for the repair request form and the "final amount" modal.
// Each returns an error message, or undefined when valid.

// Keep these equal to the limits in the Express booking validator (validators/booking.ts).
export const BOOKING_LIMITS = { addressMin: 5, addressMax: 200, problemMin: 20, problemMax: 1000, maxAmount: 100000 } as const;

const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{5,18}$/;

/** Today's date in the user's own time zone, as "YYYY-MM-DD" (the format of <input type="date">). */
export function todayString(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Required here (on a profile it is optional), because the technician needs a number to call. */
export function validateRequiredPhone(value: string): string | undefined {
  const phone = value.trim();
  if (!phone) return "Phone number is required.";
  if (!PHONE_PATTERN.test(phone)) return "Enter a valid phone number, e.g. +880 1700-123456.";
  return undefined;
}

export function validateAddress(value: string): string | undefined {
  const address = value.trim();
  if (!address) return "Address is required.";
  if (address.length < BOOKING_LIMITS.addressMin) return `Address must be at least ${BOOKING_LIMITS.addressMin} characters.`;
  if (address.length > BOOKING_LIMITS.addressMax) return `Address must be at most ${BOOKING_LIMITS.addressMax} characters.`;
  return undefined;
}

/** Today or a future date. ISO date strings compare correctly as plain text. */
export function validatePreferredDate(value: string): string | undefined {
  if (!value) return "Choose the date you want the service.";
  if (value < todayString()) return "The date must be today or later.";
  return undefined;
}

export function validateProblem(value: string): string | undefined {
  const problem = value.trim();
  if (!problem) return "Describe the problem.";
  if (problem.length < BOOKING_LIMITS.problemMin) {
    return `Describe the problem in at least ${BOOKING_LIMITS.problemMin} characters (${problem.length} so far).`;
  }
  if (problem.length > BOOKING_LIMITS.problemMax) return `Keep it under ${BOOKING_LIMITS.problemMax} characters.`;
  return undefined;
}

export function validateFinalAmount(value: string): string | undefined {
  if (!value.trim()) return "Enter the final amount.";
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "The final amount must be greater than 0.";
  if (amount > BOOKING_LIMITS.maxAmount) return `The final amount must be at most ${BOOKING_LIMITS.maxAmount}.`;
  return undefined;
}
