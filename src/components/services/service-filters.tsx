"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_NAMES, SERVICE_MODES } from "@/lib/categories";
import type { ServiceFilters } from "@/lib/services-api";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const SEARCH_DELAY_MS = 400;

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-card px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type ServiceFiltersBarProps = {
  /** The filters currently in the URL. The server page reads them and passes them in. */
  filters: ServiceFilters;
  resultCount: number;
};

// The browse page keeps its state in the URL (/services?search=&category=&mode=&sort=).
// So filters survive a reload, can be shared as a link, and the Home page can open a category.
// Changing a control updates the URL; the server page then searches MongoDB again.
export function ServiceFiltersBar({ filters, resultCount }: ServiceFiltersBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // useOptimistic shows the new choice at once, while the server loads the new results.
  const [category, setCategory] = useOptimistic(filters.category ?? "");
  const [mode, setMode] = useOptimistic(filters.mode ?? "");
  const [sort, setSort] = useOptimistic(filters.sort ?? "newest");
  const [searchText, setSearchText] = useState(filters.search ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasFilters = Boolean(searchText || category || mode || sort !== "newest");

  function toUrl(next: ServiceFilters): string {
    const query = new URLSearchParams();
    if (next.search?.trim()) query.set("search", next.search.trim());
    if (next.category) query.set("category", next.category);
    if (next.mode) query.set("mode", next.mode);
    if (next.sort && next.sort !== "newest") query.set("sort", next.sort);
    return query.size > 0 ? `/services?${query}` : "/services";
  }

  const current = (): ServiceFilters => ({ search: searchText, category, mode, sort });

  function changeSelect(change: Partial<ServiceFilters>, setOptimistic: () => void) {
    startTransition(() => {
      setOptimistic();
      router.replace(toUrl({ ...current(), ...change }), { scroll: false });
    });
  }

  function handleSearchChange(value: string) {
    setSearchText(value);
    clearTimeout(searchTimer.current);
    // Wait until the person stops typing, so each keystroke does not hit the server.
    searchTimer.current = setTimeout(() => {
      startTransition(() => router.replace(toUrl({ ...current(), search: value }), { scroll: false }));
    }, SEARCH_DELAY_MS);
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    clearTimeout(searchTimer.current);
    startTransition(() => router.replace(toUrl(current()), { scroll: false }));
  }

  function clearAll() {
    clearTimeout(searchTimer.current);
    setSearchText("");
    startTransition(() => {
      setCategory("");
      setMode("");
      setSort("newest");
      router.replace("/services", { scroll: false });
    });
  }

  return (
    <div className="mb-8 flex flex-col gap-4">
      <form
        role="search"
        onSubmit={submitSearch}
        className="grid gap-3 rounded-xl border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]"
      >
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="service-search" className="sr-only">
            Search services by title or category
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="service-search"
            type="search"
            value={searchText}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by title or category"
            className={cn(selectClass, "pl-9")}
          />
        </div>

        <label className="sr-only" htmlFor="service-category">
          Category
        </label>
        <select
          id="service-category"
          value={category}
          onChange={(event) => changeSelect({ category: event.target.value }, () => setCategory(event.target.value))}
          className={selectClass}
        >
          <option value="">All categories</option>
          {CATEGORY_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="service-mode">
          Service mode
        </label>
        <select
          id="service-mode"
          value={mode}
          onChange={(event) => changeSelect({ mode: event.target.value }, () => setMode(event.target.value))}
          className={selectClass}
        >
          <option value="">Any service mode</option>
          {SERVICE_MODES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="service-sort">
          Sort by
        </label>
        <select
          id="service-sort"
          value={sort}
          onChange={(event) => changeSelect({ sort: event.target.value }, () => setSort(event.target.value))}
          className={selectClass}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>

      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground" aria-live="polite">
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {isPending ? "Updating..." : `${resultCount} ${resultCount === 1 ? "service" : "services"} found`}
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="lg" onClick={clearAll}>
            <X aria-hidden /> Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
