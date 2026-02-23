import { z } from "zod";

export const PAYMENT_MODES = ["Cash", "Online", "Cheque", "DD"] as const;

export const feePaymentFormSchema = z.object({
    month: z.string().min(2, "Month is required"),
    totalFees: z.coerce
        .number({ invalid_type_error: "Enter a valid amount" })
        .positive("Total fees must be positive"),
    paidAmount: z.coerce
        .number({ invalid_type_error: "Enter a valid amount" })
        .nonnegative("Paid amount cannot be negative"),
    paymentDate: z.date({ message: "Payment date is required" }),
    paymentMode: z.enum(PAYMENT_MODES, { message: "Select a payment mode" }),
    notes: z.string().optional(),
}).refine((d) => d.paidAmount <= d.totalFees, {
    message: "Paid amount cannot exceed total fees",
    path: ["paidAmount"],
});

export type FeePaymentFormValues = z.infer<typeof feePaymentFormSchema>;
