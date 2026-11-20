// Validators for the Add Service form. Each returns an error message, or undefined when valid.

import { CATEGORY_NAMES } from "./categories";

// Keep these equal to the limits in the Express service validator (validators/service.ts).
export const SERVICE_LIMITS = {
  titleMin: 3,
  titleMax: 100,
  descriptionMin: 20,
  descriptionMax: 1000,
  durationMax: 50,
  areaMin: 2,
  areaMax: 100,
  maxPrice: 100000,
} as const;

export function validateServiceTitle(value: string): string | undefined {
  const title = value.trim();
  if (!title) return "Title is required.";
  if (title.length < SERVICE_LIMITS.titleMin) return `Title must be at least ${SERVICE_LIMITS.titleMin} characters.`;
  if (title.length > SERVICE_LIMITS.titleMax) return `Title must be at most ${SERVICE_LIMITS.titleMax} characters.`;
  return undefined;
}

export function validateCategory(value: string): string | undefined {
  return (CATEGORY_NAMES as readonly string[]).includes(value) ? undefined : "Choose a category.";
}

export function validateServiceDescription(value: string): string | undefined {
  const description = value.trim();
  if (!description) return "Description is required.";
  if (description.length < SERVICE_LIMITS.descriptionMin) {
    return `Describe the service in at least ${SERVICE_LIMITS.descriptionMin} characters.`;
  }
  if (description.length > SERVICE_LIMITS.descriptionMax) {
    return `Description must be at most ${SERVICE_LIMITS.descriptionMax} characters.`;
  }
  return undefined;
}

/** The price field is text in the form, so it is parsed here. */
export function validatePrice(value: string): string | undefined {
  if (!value.trim()) return "Base price is required.";
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) return "Base price must be a number greater than 0.";
  if (price > SERVICE_LIMITS.maxPrice) return `Base price must be at most ${SERVICE_LIMITS.maxPrice}.`;
  return undefined;
}

export function validateDuration(value: string): string | undefined {
  const duration = value.trim();
  if (!duration) return "Estimated duration is required.";
  if (duration.length > SERVICE_LIMITS.durationMax) {
    return `Estimated duration must be at most ${SERVICE_LIMITS.durationMax} characters.`;
  }
  return undefined;
}

export function validateServiceArea(value: string): string | undefined {
  const area = value.trim();
  if (!area) return "Service area is required.";
  if (area.length < SERVICE_LIMITS.areaMin) return `Service area must be at least ${SERVICE_LIMITS.areaMin} characters.`;
  if (area.length > SERVICE_LIMITS.areaMax) return `Service area must be at most ${SERVICE_LIMITS.areaMax} characters.`;
  return undefined;
}

/** The banner image is required; its type and size are checked when the file is picked. */
export function validateServiceImage(file: File | null): string | undefined {
  return file ? undefined : "Upload a banner image for your service.";
}
