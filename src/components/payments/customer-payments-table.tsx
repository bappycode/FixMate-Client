import Link from "next/link";
import { ClipboardList, Receipt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import type { CustomerPayment } from "@/types/payment";

export function CustomerPaymentsTable({ payments }: { payments: CustomerPayment[] }) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No payments yet"
        description="When you pay for a completed repair, the receipt shows up here."
        action={
          <Link href="/dashboard/customer/bookings" className={buttonVariants({ size: "lg" })}>
            <ClipboardList aria-hidden /> View my bookings
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table className="min-w-[820px]">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Service</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead className="pr-4">Paid on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell className="pl-4 font-medium">{payment.serviceTitle}</TableCell>
              <TableCell>{payment.technicianName}</TableCell>
              <TableCell className="font-medium">{formatPrice(payment.amount)}</TableCell>
              <TableCell>
                <code className="text-xs text-muted-foreground">{payment.transactionId}</code>
              </TableCell>
              <TableCell className="pr-4 whitespace-nowrap">{formatDate(payment.paidAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
