import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";
import type { Payment } from "@/types/payment";

export function TransactionsTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Payments appear here as soon as customers pay for completed jobs."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table className="min-w-[1040px]">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Customer</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead className="pr-4">Paid on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell className="pl-4">
                <div className="flex flex-col">
                  <span className="font-medium">{payment.customerName}</span>
                  <span className="text-xs text-muted-foreground">{payment.customerEmail}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{payment.technicianName}</span>
                  <span className="text-xs text-muted-foreground">{payment.technicianEmail}</span>
                </div>
              </TableCell>
              <TableCell>{payment.serviceTitle}</TableCell>
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
