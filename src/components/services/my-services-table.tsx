"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageOpen, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ApprovalBadge } from "@/components/shared/approval-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/types/service";

const errorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

export function MyServicesTable({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [switching, setSwitching] = useState<string[]>([]);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function toggleAvailability(service: Service, isAvailable: boolean) {
    setSwitching((ids) => [...ids, service._id]);
    try {
      const { service: updated } = await apiFetch<{ service: Service }>(`/api/services/${service._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable }),
      });
      setServices((list) => list.map((item) => (item._id === updated._id ? updated : item)));
      toast.success(isAvailable ? "Service is available again." : "Service switched off. It is hidden from public pages.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update availability."));
    } finally {
      setSwitching((ids) => ids.filter((id) => id !== service._id));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiFetch<null>(`/api/services/${toDelete._id}`, { method: "DELETE" });
      setServices((list) => list.filter((item) => item._id !== toDelete._id));
      toast.success(`"${toDelete.title}" was deleted.`);
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete the service."));
    } finally {
      setDeleting(false);
    }
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="You have not added any services yet"
        description="Add your first repair service. It goes live once an admin approves it."
        action={
          <Link href="/dashboard/technician/add-service" className={buttonVariants({ size: "lg" })}>
            <PlusCircle aria-hidden /> Add a service
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={service.image}
                      alt=""
                      width={56}
                      height={42}
                      className="h-[42px] w-14 shrink-0 rounded-md bg-muted object-cover"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="max-w-64 truncate font-medium">{service.title}</span>
                      <span className="text-xs text-muted-foreground">{service.serviceArea}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell className="font-medium">{formatPrice(service.basePrice)}</TableCell>
                <TableCell>
                  <ApprovalBadge status={service.approvalStatus} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Switch
                      aria-label={`Availability of ${service.title}`}
                      checked={service.isAvailable}
                      disabled={switching.includes(service._id)}
                      onCheckedChange={(checked) => toggleAvailability(service, checked)}
                    />
                    <span className="flex flex-col text-xs leading-tight">
                      <span className="font-medium">{service.isAvailable ? "Available" : "Off"}</span>
                      {service.approvalStatus !== "approved" ? (
                        <span className="text-muted-foreground">Hidden until approved</span>
                      ) : null}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/technician/my-services/${service._id}/edit`}
                      className={buttonVariants({ variant: "outline", size: "lg" })}
                    >
                      <Pencil aria-hidden /> Edit
                    </Link>
                    <Button variant="destructive" size="lg" onClick={() => setToDelete(service)}>
                      <Trash2 aria-hidden /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Delete this service?"
        description={`"${toDelete?.title ?? ""}" will be removed for good. Existing bookings keep their own copy of the details.`}
        confirmLabel="Delete service"
        destructive
        pending={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
