"use client";

import { Smartphone, Wrench } from "lucide-react";
import { ROLE_LABELS, SIGN_UP_ROLES, type SignUpRole } from "@/lib/roles";

const ROLE_DETAILS = {
  customer: { icon: Smartphone, description: "Book repairs and track every job." },
  technician: { icon: Wrench, description: "List your services and manage requests." },
} satisfies Record<SignUpRole, { icon: React.ElementType; description: string }>;

type RolePickerProps = {
  value: SignUpRole;
  onChange: (role: SignUpRole) => void;
};

export function RolePicker({ value, onChange }: RolePickerProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-medium">I want to join as</legend>
      <div className="grid grid-cols-2 gap-3">
        {SIGN_UP_ROLES.map((role) => {
          const { icon: Icon, description } = ROLE_DETAILS[role];
          return (
            <label key={role} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={role}
                checked={value === role}
                onChange={() => onChange(role)}
                className="peer sr-only"
              />
              <span className="flex h-full flex-col gap-1 rounded-xl border bg-card p-3.5 transition peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/25 peer-focus-visible:ring-2 peer-focus-visible:ring-ring hover:border-primary/50">
                <Icon className="size-5 text-primary" aria-hidden />
                <span className="text-sm font-semibold">{ROLE_LABELS[role]}</span>
                <span className="text-xs leading-snug text-muted-foreground">{description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
