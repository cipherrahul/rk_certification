import { z } from "zod";

export const courseSchema = z.object({
    name: z.string().min(2, "Course name is required"),
    code: z.string().min(2, "Course code is required").optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
