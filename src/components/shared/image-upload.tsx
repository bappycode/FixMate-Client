"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "@/lib/image-rules";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  label: string;
  currentImage?: string | null;
  onFileChange: (file: File) => void;
  error?: string;
  disabled?: boolean;
};

export function ImageUpload({ label, currentImage, onFileChange, error, disabled }: ImageUploadProps) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>();
  const shownError = fileError ?? error;
  const shownImage = previewUrl ?? currentImage;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setFileError(problem);
      return;
    }
    setFileError(undefined);
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm leading-none font-medium">{label}</span>

      <input
        id={inputId}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={shownError ? `${inputId}-error` : undefined}
        className="peer sr-only"
      />
      <label
        htmlFor={inputId}
        className={cn(
          "relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed bg-muted/40 text-center text-muted-foreground transition-colors hover:border-primary hover:bg-tint/60 peer-focus-visible:border-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
          shownError && "border-destructive",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        {shownImage ? (
          <>
            <Image src={shownImage} alt="Service banner" fill unoptimized={Boolean(previewUrl)} sizes="340px" className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-2 text-sm font-medium text-white">
              Click to change image
            </span>
          </>
        ) : (
          <>
            <ImagePlus className="size-8" aria-hidden />
            <span className="text-sm font-medium text-foreground">Click to upload a banner image</span>
            <span className="text-xs">JPG, PNG, WebP or GIF, up to 2 MB</span>
          </>
        )}
      </label>

      {shownError ? (
        <p id={`${inputId}-error`} role="alert" className="text-sm text-destructive">
          {shownError}
        </p>
      ) : null}
    </div>
  );
}
