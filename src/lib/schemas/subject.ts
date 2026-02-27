import { z } from "zod";

export const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    course: z.string().min(1, "Course is required"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
