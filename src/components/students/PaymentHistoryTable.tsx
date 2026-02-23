import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock } from "lucide-react";

interface PaymentRecord {
    id: string;
    receipt_number: string;
    month: string;
    total_fees: number;
    paid_amount: number;
    remaining_amount: number;
    payment_date: string;
    payment_mode: string;
    notes?: string;
}

interface PaymentHistoryTableProps {
    payments: PaymentRecord[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
    if (!payments || payments.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground text-sm">
                No payment records found. Record the first payment to get started.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                        <TableHead>Receipt No.</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead>Total Fees</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-mono text-xs font-medium">{p.receipt_number}</TableCell>
                            <TableCell className="font-medium">{p.month}</TableCell>
                            <TableCell>₹{Number(p.total_fees).toLocaleString("en-IN")}</TableCell>
                            <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                                ₹{Number(p.paid_amount).toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell className={Number(p.remaining_amount) > 0 ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                                ₹{Number(p.remaining_amount).toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="text-xs">{p.payment_mode}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {new Date(p.payment_date).toLocaleDateString("en-IN")}
                            </TableCell>
                            <TableCell>
                                {Number(p.remaining_amount) === 0 ? (
                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium">
                                        <Clock className="w-3.5 h-3.5" /> Partial
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
