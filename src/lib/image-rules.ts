const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export function validateImageFile(file: File): string | undefined {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Only JPG, PNG, WebP or GIF images are allowed.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 2 MB or smaller.";
  }
  return undefined;
}
