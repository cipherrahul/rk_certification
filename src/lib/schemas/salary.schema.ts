import { z } from "zod";

const numericField = (min = 0) =>
    z.preprocess((val) => Number(val), z.number().min(min));

export const salaryRecordSchema = z.object({
    month: z.string().min(1, "Month is required"),
    year: numericField(2020),
    basicSalary: numericField(0),
    allowances: numericField(0),
    deductions: numericField(0),
    paymentStatus: z.enum(["Pending", "Paid"]),
    paymentDate: z.date().optional().nullable(),
    slipNotes: z.string().optional(),
});

export type SalaryRecordFormValues = {
    month: string;
    year: number;
    basicSalary: number;
    allowances: number;
    deductions: number;
    paymentStatus: "Pending" | "Paid";
    paymentDate?: Date | null;
    slipNotes?: string;
};
