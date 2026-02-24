import { z } from "zod";

export const PAYMENT_MODES = ["Cash", "Online", "Cheque", "DD"] as const;

export const feePaymentFormSchema = z.object({
    month: z.string().min(2, "Month is required"),
    totalFees: z.coerce
        .number()
        .positive("Total fees must be positive"),
    paidAmount: z.coerce
        .number()
        .nonnegative("Paid amount cannot be negative"),
    paymentDate: z.date(),
    paymentMode: z.enum(PAYMENT_MODES),
    notes: z.string().optional(),
}).refine((d) => d.paidAmount <= d.totalFees, {
    message: "Paid amount cannot exceed total fees",
    path: ["paidAmount"],
});

export type FeePaymentFormValues = z.infer<typeof feePaymentFormSchema>;
