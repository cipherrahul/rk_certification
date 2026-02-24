import { z } from "zod";

export const enquiryFormSchema = z.object({
    studentName: z
        .string()
        .min(2, "Student name must be at least 2 characters.")
        .max(100, "Student name must be less than 100 characters."),
    parentName: z
        .string()
        .min(2, "Parent name must be at least 2 characters.")
        .max(100, "Parent name must be less than 100 characters."),
    class_: z
        .string()
        .min(1, "Please select a class."),
    courseInterested: z
        .string()
        .min(1, "Please select a course."),
    mobileNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
    email: z
        .string()
        .email("Please enter a valid email address."),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters.")
        .max(500, "Message must be less than 500 characters."),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;
