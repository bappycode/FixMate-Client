// One set of rules for uploaded images. The form checks them for instant feedback,
// and the upload route checks them again, because the browser can never be trusted.

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

/** Returns an error message when the file is not acceptable, or undefined when it is. */
export function validateImageFile(file: File): string | undefined {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Only JPG, PNG, WebP or GIF images are allowed.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 2 MB or smaller.";
  }
  return undefined;
}
