import { z } from "zod";

export const examSchema = z.object({
    title: z.string().min(2, "Exam title is required"),
    examDate: z.date({ message: "Exam date is required" }),
    course: z.string().min(2, "Course is required"),
    academicSession: z
        .string()
        .min(4, "Academic session is required")
        .regex(/^\d{4}-\d{2,4}$/, "Format must be e.g. 2026-27"),
    totalMarks: z.number().min(1, "Total marks required"),
    passingMarks: z.number().min(1, "Passing marks required"),
    branchId: z.string().uuid("Invalid branch").or(z.literal("")).transform(v => v === "" ? undefined : v).optional(),
});

export type ExamFormValues = z.infer<typeof examSchema>;

export const markEntrySchema = z.object({
    examId: z.string().uuid(),
    studentId: z.string().uuid(),
    subjectName: z.string().min(1, "Subject name is required"),
    marksObtained: z.coerce.number().min(0, "Invalid marks"),
    isAbsent: z.boolean().default(false),
    remarks: z.string().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
});

export type MarkEntryValues = z.infer<typeof markEntrySchema>;

export const bulkMarkEntrySchema = z.array(markEntrySchema);
