import { z } from "zod";

export const applicationFormSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number."),
    jobId: z.string().min(1, "Job ID is required."),
    jobTitle: z.string().min(1, "Job title is required."),
    currentLocation: z.string().min(2, "Please enter your current location."),
    highestQualification: z.string().min(2, "Please enter your highest qualification."),
    experienceYears: z.string().min(1, "Please select your experience level."),
    coverLetter: z.string().min(50, "Cover letter must be at least 50 characters.").max(1000, "Cover letter must be less than 1000 characters."),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions to apply.",
    }),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
