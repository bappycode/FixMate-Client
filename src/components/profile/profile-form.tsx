"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { RoleBadge } from "@/components/shared/role-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import {
  hasErrors,
  PROFILE_LIMITS,
  validateArea,
  validateBio,
  validateName,
  validatePhone,
  type FieldErrors,
} from "@/lib/validation";
import { AvatarUpload } from "./avatar-upload";

type Field = "name" | "phone" | "area" | "bio";
type ProfileValues = Record<Field, string>;

const validators: Record<Field, (value: string) => string | undefined> = {
  name: validateName,
  phone: validatePhone,
  area: validateArea,
  bio: validateBio,
};

type ProfileFormProps = {
  user: { email: string; role: string; image: string | null } & ProfileValues;
};

type UpdateProfileResponse = { user: ProfileValues };

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  // The live session keeps the avatar current; refetch() makes the navbar and top bar update too.
  const { data: session, refetch } = authClient.useSession();

  const [saved, setSaved] = useState<ProfileValues>({
    name: user.name,
    phone: user.phone,
    area: user.area,
    bio: user.bio,
  });
  const [values, setValues] = useState<ProfileValues>(saved);
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [avatarKey, setAvatarKey] = useState(0); // changing it resets the photo picker after a save
  const [submitting, setSubmitting] = useState(false);

  const fields = Object.keys(values) as Field[];
  const dirty = photo !== null || fields.some((field) => values[field].trim() !== saved[field]);

  const validateField = (field: Field, value: string) =>
    setErrors((current) => ({ ...current, [field]: validators[field](value) }));

  const handleChange =
    (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      if (errors[field]) validateField(field, value);
    };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = Object.fromEntries(fields.map((field) => [field, validators[field](values[field])]));
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = fields.find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload the new photo (if any), 2. save everything through the Express API.
      const image = photo ? await uploadImage(photo) : undefined;
      const payload = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        area: values.area.trim(),
        bio: values.bio.trim(),
        ...(image ? { image } : {}),
      };
      const { user: updated } = await apiFetch<UpdateProfileResponse>("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      // Refresh the live session (navbar, top bar) and any server-rendered data on the page.
      await refetch();
      router.refresh();

      const next = { name: updated.name, phone: updated.phone, area: updated.area, bio: updated.bio };
      setSaved(next);
      setValues(next);
      setPhoto(null);
      setAvatarKey((key) => key + 1);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-3xl flex-col gap-8 rounded-xl border bg-card p-6 sm:p-8"
    >
      <AvatarUpload
        key={avatarKey}
        name={values.name}
        currentImage={session?.user.image ?? user.image}
        onFileChange={setPhoto}
        disabled={submitting}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="name"
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange("name")}
          onBlur={() => validateField("name", values.name)}
          error={errors.name}
        />
        <FormField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+880 1700-123456"
          value={values.phone}
          onChange={handleChange("phone")}
          onBlur={() => validateField("phone", values.phone)}
          error={errors.phone}
        />

        <div className="sm:col-span-2">
          <FormField
            id="area"
            label="Area"
            autoComplete="address-level2"
            placeholder="e.g. Mirpur, Dhaka"
            value={values.area}
            onChange={handleChange("area")}
            onBlur={() => validateField("area", values.area)}
            error={errors.area}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="Technicians: share your skills and experience. Customers: anything a technician should know."
            value={values.bio}
            onChange={handleChange("bio")}
            onBlur={() => validateField("bio", values.bio)}
            aria-invalid={errors.bio ? true : undefined}
            aria-describedby={errors.bio ? "bio-error" : undefined}
          />
          <div className="flex justify-between gap-4 text-sm">
            <p id="bio-error" role={errors.bio ? "alert" : undefined} className="text-destructive">
              {errors.bio}
            </p>
            <span className="ml-auto text-muted-foreground">
              {values.bio.length}/{PROFILE_LIMITS.bioMax}
            </span>
          </div>
        </div>

        <FormField id="email" label="Email" value={user.email} disabled readOnly />
        <div className="flex flex-col gap-1.5">
          <Label>Role</Label>
          <div className="flex h-10 items-center">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t pt-6">
        {!dirty ? <p className="text-sm text-muted-foreground">No changes to save.</p> : null}
        <Button type="submit" size="xl" disabled={submitting || !dirty}>
          {submitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {submitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
