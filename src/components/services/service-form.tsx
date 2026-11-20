"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { ImageUpload } from "@/components/shared/image-upload";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";
import { CATEGORY_NAMES, type ServiceMode } from "@/lib/categories";
import {
  SERVICE_LIMITS,
  validateCategory,
  validateDuration,
  validatePrice,
  validateServiceArea,
  validateServiceDescription,
  validateServiceImage,
  validateServiceTitle,
} from "@/lib/service-validation";
import { uploadImage } from "@/lib/upload";
import { hasErrors, type FieldErrors } from "@/lib/validation";
import type { Service } from "@/types/service";
import { ModePicker } from "./mode-picker";

type TextField = "title" | "category" | "description" | "basePrice" | "estimatedDuration" | "serviceArea";
type Field = TextField | "image";

const EMPTY_VALUES: Record<TextField, string> = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceArea: "",
};

const validators: Record<TextField, (value: string) => string | undefined> = {
  title: validateServiceTitle,
  category: validateCategory,
  description: validateServiceDescription,
  basePrice: validatePrice,
  estimatedDuration: validateDuration,
  serviceArea: validateServiceArea,
};

type ServiceFormProps = {
  /** The signed-in technician. Shown read-only; the server takes them from the token anyway. */
  technician: { name: string; email: string };
  /** Pass a service to edit it. Leave it out to add a new one. */
  service?: Service;
};

// One form for both "add" and "edit", so the two can never drift apart.
export function ServiceForm({ technician, service }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(service);

  const [values, setValues] = useState<Record<TextField, string>>(
    service
      ? {
          title: service.title,
          category: service.category,
          description: service.description,
          basePrice: String(service.basePrice),
          estimatedDuration: service.estimatedDuration,
          serviceArea: service.serviceArea,
        }
      : EMPTY_VALUES,
  );
  const [serviceMode, setServiceMode] = useState<ServiceMode>(service?.serviceMode ?? "Home Visit");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [formKey, setFormKey] = useState(0); // changing it clears the image picker after a save
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field: TextField, value: string) =>
    setErrors((current) => ({ ...current, [field]: validators[field](value) }));

  const handleChange =
    (field: TextField) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      // Once a field has shown an error, re-check it as the user types.
      if (errors[field]) validateField(field, value);
    };

  // Props shared by every text field: value, change and blur handlers, and its error.
  const bind = (field: TextField) => ({
    value: values[field],
    onChange: handleChange(field),
    onBlur: () => validateField(field, values[field]),
    error: errors[field],
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const textFields = Object.keys(EMPTY_VALUES) as TextField[];
    const nextErrors: FieldErrors<Field> = {
      ...Object.fromEntries(textFields.map((field) => [field, validators[field](values[field])])),
      // When editing, the saved banner is kept unless a new file is chosen.
      image: isEditing ? undefined : validateServiceImage(photo),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = textFields.find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload a new banner to ImgBB if one was chosen, 2. save through the Express API.
      const image = photo ? await uploadImage(photo) : service?.image;
      const payload = JSON.stringify({
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        image,
        basePrice: Number(values.basePrice),
        estimatedDuration: values.estimatedDuration.trim(),
        serviceMode,
        serviceArea: values.serviceArea.trim(),
      });

      if (service) {
        await apiFetch<{ service: Service }>(`/api/services/${service._id}`, { method: "PATCH", body: payload });
        toast.success("Service updated. It is waiting for admin approval again.");
        router.push("/dashboard/technician/my-services");
        router.refresh();
        return;
      }

      await apiFetch<{ service: Service }>("/api/services", { method: "POST", body: payload });
      toast.success("Service submitted! It is waiting for admin approval.");
      setValues(EMPTY_VALUES);
      setServiceMode("Home Visit");
      setPhoto(null);
      setErrors({});
      setFormKey((key) => key + 1);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Could not ${isEditing ? "update" : "add"} your service. Please try again.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid max-w-5xl gap-8 rounded-xl border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_340px]"
    >
      <div className="flex flex-col gap-5">
        <FormField id="title" label="Service title" placeholder="e.g. iPhone Screen Replacement" {...bind("title")} />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="category"
            label="Category"
            placeholder="Select a category"
            options={CATEGORY_NAMES}
            {...bind("category")}
          />
          <FormField
            id="basePrice"
            label="Base price (USD)"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="e.g. 45"
            {...bind("basePrice")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            placeholder="What does the service include? Mention parts, warranty and anything the customer should know."
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? "description-error" : undefined}
            value={values.description}
            onChange={handleChange("description")}
            onBlur={() => validateField("description", values.description)}
          />
          <div className="flex justify-between gap-4 text-sm">
            <p id="description-error" role={errors.description ? "alert" : undefined} className="text-destructive">
              {errors.description}
            </p>
            <span className="ml-auto text-muted-foreground">
              {values.description.length}/{SERVICE_LIMITS.descriptionMax}
            </span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="estimatedDuration"
            label="Estimated duration"
            placeholder="e.g. 2-3 hours"
            {...bind("estimatedDuration")}
          />
          <FormField id="serviceArea" label="Service area" placeholder="e.g. Dhanmondi, Dhaka" {...bind("serviceArea")} />
        </div>

        <ModePicker value={serviceMode} onChange={setServiceMode} disabled={submitting} />
      </div>

      <div className="flex flex-col gap-5">
        <ImageUpload
          key={formKey}
          label="Service banner"
          currentImage={service?.image}
          onFileChange={(file) => {
            setPhoto(file);
            setErrors((current) => ({ ...current, image: undefined }));
          }}
          error={errors.image}
          disabled={submitting}
        />

        <div className="flex flex-col gap-5 rounded-lg border bg-muted/40 p-4">
          <FormField id="technicianName" label="Technician" value={technician.name} disabled readOnly />
          <FormField id="technicianEmail" label="Technician email" value={technician.email} disabled readOnly />
        </div>
      </div>

      <div className="flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center lg:col-span-2">
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? "Saving changes sends this service back to pending until an admin approves it again."
            : "New services are reviewed by an admin before they appear on the public site."}
        </p>
        <Button type="submit" size="xl" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {submitting ? "Saving..." : isEditing ? "Save changes" : "Submit for approval"}
        </Button>
      </div>
    </form>
  );
}
