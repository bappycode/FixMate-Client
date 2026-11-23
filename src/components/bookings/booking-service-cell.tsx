import Image from "next/image";
import type { Booking } from "@/types/booking";

export function BookingServiceCell({ booking }: { booking: Pick<Booking, "serviceImage" | "serviceTitle" | "category"> }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={booking.serviceImage}
        alt=""
        width={56}
        height={42}
        className="h-[42px] w-14 shrink-0 rounded-md bg-muted object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <span className="max-w-56 truncate font-medium">{booking.serviceTitle}</span>
        <span className="text-xs text-muted-foreground">{booking.category}</span>
      </div>
    </div>
  );
}
