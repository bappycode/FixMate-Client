"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, CircleCheck, X } from "lucide-react";
import { toast } from "sonner";
import { ApprovalBadge } from "@/components/shared/approval-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/format";
import type { Service } from "@/types/service";

type Status = Service["approvalStatus"];
type Filter = Status | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const EMPTY_TEXT: Record<Filter, { title: string; description: string }> = {
  pending: { title: "Nothing waiting for review", description: "New and edited services show up here for approval." },
  approved: { title: "No approved services yet", description: "Approved services appear on the public site." },
  rejected: { title: "No rejected services", description: "Services you reject are listed here." },
  all: { title: "No services yet", description: "Technicians have not added any services." },
};

export function ServicesApprovalTable({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [filter, setFilter] = useState<Filter>("pending");
  const [working, setWorking] = useState<string | null>(null);
  const [toReject, setToReject] = useState<Service | null>(null);

  const countOf = (value: Filter) =>
    value === "all" ? services.length : services.filter((service) => service.approvalStatus === value).length;
  const visible = filter === "all" ? services : services.filter((service) => service.approvalStatus === filter);

  async function decide(service: Service, approvalStatus: "approved" | "rejected") {
    setWorking(service._id);
    try {
      const { service: updated } = await apiFetch<{ service: Service }>(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      setServices((list) => list.map((item) => (item._id === updated._id ? updated : item)));
      toast.success(approvalStatus === "approved" ? `"${service.title}" is now public.` : `"${service.title}" was rejected.`);
      setToReject(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the service.");
    } finally {
      setWorking(null);
    }
  }

  return (
    <>
      <FilterTabs
        label="Filter by approval status"
        value={filter}
        onChange={setFilter}
        options={FILTERS.map(({ value, label }) => ({ value, label, count: countOf(value) }))}
      />

      {visible.length === 0 ? (
        <EmptyState icon={CircleCheck} {...EMPTY_TEXT[filter]} />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Service</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((service) => (
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
                        <span className="max-w-56 truncate font-medium">{service.title}</span>
                        <span className="text-xs text-muted-foreground">{service.serviceMode}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{service.technicianName}</span>
                      <span className="text-xs text-muted-foreground">{service.technicianEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell className="font-medium">{formatPrice(service.basePrice)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(service.createdAt)}</TableCell>
                  <TableCell>
                    <ApprovalBadge status={service.approvalStatus} />
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-2">
                      {service.approvalStatus !== "approved" ? (
                        <Button size="lg" disabled={working === service._id} onClick={() => decide(service, "approved")}>
                          <Check aria-hidden /> Approve
                        </Button>
                      ) : null}
                      {service.approvalStatus !== "rejected" ? (
                        <Button
                          variant="destructive"
                          size="lg"
                          disabled={working === service._id}
                          onClick={() => setToReject(service)}
                        >
                          <X aria-hidden /> Reject
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={toReject !== null}
        onOpenChange={(open) => {
          if (!open) setToReject(null);
        }}
        title="Reject this service?"
        description={`"${toReject?.title ?? ""}" will stay hidden from the public site. The technician can edit it and send it for review again.`}
        confirmLabel="Reject service"
        destructive
        pending={working !== null}
        onConfirm={() => toReject && decide(toReject, "rejected")}
      />
    </>
  );
}
