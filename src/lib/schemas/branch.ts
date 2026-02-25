import { z } from "zod";

export const branchSchema = z.object({
    name: z.string().min(2, "Branch name must be at least 2 characters"),
    code: z.string().min(2, "Branch code must be at least 2 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    openingDate: z.date({ message: "Opening date is required" }),
    status: z.enum(["Active", "Inactive"]),
});

export const branchClassSchema = z.object({
    branchId: z.string().uuid("Invalid branch ID"),
    name: z.string().min(2, "Class name is required"),
    courseType: z.string().min(2, "Course type is required"),
    duration: z.string().min(1, "Duration is required"),
    feeStructure: z.object({
        admissionFee: z.number().min(0, "Invalid fee"),
        monthlyFee: z.number().min(0, "Invalid fee"),
        totalFee: z.number().min(0, "Invalid fee"),
    }),
});

export const branchExpenseSchema = z.object({
    branchId: z.string().uuid("Invalid branch ID"),
    type: z.enum(["Rent", "Electricity", "Marketing", "Other", "Salary"]),
    amount: z.number().min(0, "Amount must be positive"),
    date: z.date({ message: "Date is required" }),
    description: z.string().optional(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;
export type BranchClassFormValues = z.infer<typeof branchClassSchema>;
export type BranchExpenseFormValues = z.infer<typeof branchExpenseSchema>;
