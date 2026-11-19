"use client";

import { useEffect, useId, useState } from "react";
import { Camera } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { buttonVariants } from "@/components/ui/button";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "@/lib/image-rules";
import { cn } from "@/lib/utils";

type AvatarUploadProps = {
  name: string;
  /** The saved photo, shown until the user picks a new one. */
  currentImage?: string | null;
  /** Called with the chosen file. Nothing is uploaded here; the form uploads on save. */
  onFileChange: (file: File) => void;
  disabled?: boolean;
};

export function AvatarUpload({ name, currentImage, onFileChange, disabled }: AvatarUploadProps) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  // Free the temporary preview URL when it is replaced or the component goes away.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be picked again later
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(undefined);
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  }

  return (
    <div className="flex items-center gap-5">
      <UserAvatar name={name || "?"} image={previewUrl ?? currentImage} className="size-24" />

      <div className="flex flex-col items-start gap-2">
        <input
          id={inputId}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "cursor-pointer peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <Camera aria-hidden /> Change photo
        </label>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF, up to 2 MB.</p>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
