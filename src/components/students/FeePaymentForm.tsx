"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
    feePaymentFormSchema, FeePaymentFormValues, PAYMENT_MODES,
} from "@/lib/schemas/fee";
import { createFeePaymentAction } from "@/lib/actions/fee.action";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

interface FeePaymentFormProps {
    studentId: string;
    studentName: string;
}

export function FeePaymentForm({ studentId, studentName }: FeePaymentFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear();

    const form = useForm<FeePaymentFormValues>({
        resolver: zodResolver(feePaymentFormSchema),
        defaultValues: {
            month: "",
            totalFees: 0,
            paidAmount: 0,
            paymentMode: "Cash",
            notes: "",
        },
    });

    const totalFees = form.watch("totalFees") || 0;
    const paidAmount = form.watch("paidAmount") || 0;
    const remainingAmount = Math.max(0, Number(totalFees) - Number(paidAmount));

    async function onSubmit(data: FeePaymentFormValues) {
        setIsLoading(true);
        try {
            const result = await createFeePaymentAction(studentId, data);
            if (result.success) {
                toast({
                    title: "Payment Recorded",
                    description: `Receipt No: ${result.receiptNumber}`,
                });
                router.push(`/admin/students/${studentId}`);
                router.refresh();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Student name (read only info) */}
                <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Recording payment for</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{studentName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Month */}
                    <FormField control={form.control} name="month"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Month</FormLabel>
                                <Select onValueChange={(v) => field.onChange(`${v} ${currentYear}`)} >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select month">
                                                {field.value || "Select month"}
                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {MONTHS.map((m) => (
                                            <SelectItem key={m} value={m}>{m} {currentYear}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Payment Date */}
                    <FormField control={form.control} name="paymentDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col pt-2">
                                <FormLabel>Payment Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                            disabled={(d) => d > new Date()} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Total Fees */}
                    <FormField control={form.control} name="totalFees"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Fees (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g. 5000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Paid Amount */}
                    <FormField control={form.control} name="paidAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paid Amount (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g. 3000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Remaining Amount (auto-computed) */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <span className="text-sm font-medium text-muted-foreground">Remaining Amount</span>
                    <span className={cn(
                        "text-xl font-bold",
                        remainingAmount > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                        ₹{remainingAmount.toLocaleString("en-IN")}
                    </span>
                </div>

                {/* Payment Mode */}
                <FormField control={form.control} name="paymentMode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {PAYMENT_MODES.map((m) => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Notes */}
                <FormField control={form.control} name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Paid via PhonePe, Txn ID: XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Recording Payment...</>
                    ) : (
                        "Record Payment & Generate Receipt"
                    )}
                </Button>
            </form>
        </Form>
    );
}
