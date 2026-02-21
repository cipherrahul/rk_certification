import * as z from "zod";

export const certificateFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    courseName: z.string().min(2, "Course Name is required"),
    completionDate: z.date({
        message: "A completion date is required",
    }),
    grade: z.string().min(1, "Grade is required"),
    duration: z.string().min(1, "Duration is required"),
    photo: z.any().optional(), // For storing the base64 image data URL locally
});

export type CertificateFormValues = z.infer<typeof certificateFormSchema>;
