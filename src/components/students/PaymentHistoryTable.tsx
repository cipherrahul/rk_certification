import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CheckCircle, Download } from "lucide-react";

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
    whatsapp_status: string;
    pdf_url?: string;
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
                        <TableHead>Status (WA)</TableHead>
                        <TableHead>Receipt</TableHead>
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
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-[10px] px-1.5 py-0",
                                        p.whatsapp_status === "sent" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            p.whatsapp_status === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                                                "bg-slate-50 text-slate-600 border-slate-200"
                                    )}
                                >
                                    {p.whatsapp_status === "sent" && <CheckCircle className="w-2.5 h-2.5 mr-1" />}
                                    {p.whatsapp_status.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {p.pdf_url ? (
                                    <a href={p.pdf_url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600">
                                            <Download className="w-3.5 h-3.5" />
                                        </Button>
                                    </a>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground italic">Generating...</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
