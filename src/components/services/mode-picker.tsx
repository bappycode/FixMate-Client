"use client";

import { House, Store } from "lucide-react";
import { SERVICE_MODES, type ServiceMode } from "@/lib/categories";

const MODE_DETAILS = {
  "Home Visit": { icon: House, description: "You travel to the customer's address." },
  "Shop Drop-off": { icon: Store, description: "The customer brings the device to you." },
} satisfies Record<ServiceMode, { icon: React.ElementType; description: string }>;

type ModePickerProps = {
  value: ServiceMode;
  onChange: (mode: ServiceMode) => void;
  disabled?: boolean;
};

export function ModePicker({ value, onChange, disabled }: ModePickerProps) {
  return (
    <fieldset className="flex flex-col gap-2" disabled={disabled}>
      <legend className="mb-1.5 text-sm font-medium">Service mode</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_MODES.map((mode) => {
          const { icon: Icon, description } = MODE_DETAILS[mode];
          return (
            <label key={mode} className="cursor-pointer">
              <input
                type="radio"
                name="serviceMode"
                value={mode}
                checked={value === mode}
                onChange={() => onChange(mode)}
                className="peer sr-only"
              />
              <span className="flex h-full flex-col gap-1 rounded-xl border bg-card p-3.5 transition peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/25 peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-primary/50">
                <Icon className="size-5 text-primary" aria-hidden />
                <span className="text-sm font-semibold">{mode}</span>
                <span className="text-xs leading-snug text-muted-foreground">{description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
