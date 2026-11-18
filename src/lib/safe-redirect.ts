export const REDIRECT_PARAM = "redirect";

/**
 * Accepts only same-site paths such as "/services/123". Anything that could
 * leave the site ("https://evil.com", "//evil.com", "/\evil.com") is rejected,
 * so a crafted sign-in link cannot be used as an open redirect.
 */
export function getSafeRedirect(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  return value;
}
