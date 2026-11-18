import Image from "next/image";
import Link from "next/link";
import { House, MapPin, Store, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/types/service";

// Every card has the same structure and the footer is pushed to the bottom (mt-auto),
// so cards in a grid are always equal in height and width.
export function ServiceCard({ service }: { service: Service }) {
  const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg leading-snug font-semibold">{service.title}</h3>

        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <ModeIcon className="size-4 shrink-0" aria-hidden />
            {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{service.technicianName}</span>
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="font-heading text-xl font-bold">{formatPrice(service.basePrice)}</p>
          </div>
          <Link href={`/services/${service._id}`} className={buttonVariants({ size: "lg" })}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Same outline as ServiceCard, shown while the data loads. */
export function ServiceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card" aria-hidden>
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-2 flex flex-col gap-2">
          <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <div className="h-9 w-16 animate-pulse rounded bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
