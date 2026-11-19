// Small hand-written validators. Each returns an error message, or undefined when valid.

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{5,18}$/;

// Keep these equal to the limits in the Express profile validator.
export const PROFILE_LIMITS = { nameMax: 80, phoneMax: 20, areaMax: 100, bioMax: 500 } as const;

export function validateName(value: string): string | undefined {
  const name = value.trim();
  if (!name) return "Full name is required.";
  if (name.length < 2) return "Full name must be at least 2 characters.";
  if (name.length > PROFILE_LIMITS.nameMax) return `Full name must be at most ${PROFILE_LIMITS.nameMax} characters.`;
  return undefined;
}

/** Optional: an empty phone is fine, a filled one must look like a phone number. */
export function validatePhone(value: string): string | undefined {
  const phone = value.trim();
  if (phone && !PHONE_PATTERN.test(phone)) return "Enter a valid phone number, e.g. +880 1700-123456.";
  return undefined;
}

export function validateArea(value: string): string | undefined {
  return value.trim().length > PROFILE_LIMITS.areaMax
    ? `Area must be at most ${PROFILE_LIMITS.areaMax} characters.`
    : undefined;
}

export function validateBio(value: string): string | undefined {
  return value.trim().length > PROFILE_LIMITS.bioMax
    ? `Bio must be at most ${PROFILE_LIMITS.bioMax} characters.`
    : undefined;
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Email is required.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
}

/** Sign-up rules: at least 6 characters, one uppercase and one lowercase letter. */
export function validateNewPassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
  return undefined;
}

/** Sign-in only checks presence. Complexity rules apply when a password is created. */
export function validatePasswordPresent(value: string): string | undefined {
  return value ? undefined : "Password is required.";
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
