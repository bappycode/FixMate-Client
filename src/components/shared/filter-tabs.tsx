import { cn } from "@/lib/utils";

type FilterTabsProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count: number }[];
};

export function FilterTabs<T extends string>({ label, value, onChange, options }: FilterTabsProps<T>) {
  return (
    <div role="group" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:border-primary hover:text-foreground",
          )}
        >
          {option.label} <span className="opacity-80">({option.count})</span>
        </button>
      ))}
    </div>
  );
}
