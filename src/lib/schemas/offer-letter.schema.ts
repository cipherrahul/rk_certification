import { z } from "zod";

export const offerLetterSchema = z.object({
    // Personal Info
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    fatherName: z.string().min(2, "Father's name must be at least 2 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
    employeeEmail: z.string().email("Please enter a valid email address."),

    // Job Details
    position: z.string().min(2, "Position title is required."),
    department: z.string().min(2, "Department is required."),
    workLocation: z.string().min(2, "Work location is required."),
    employmentType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"], {
        required_error: "Please select employment type.",
    }),

    // Schedule
    joiningDate: z.string().min(1, "Joining date is required."),
    probationPeriod: z.string().min(1, "Probation period is required."),
    workingHours: z.string().min(1, "Working hours are required."),

    // Salary
    basicSalary: z.coerce.number().min(1, "Basic salary is required."),
    hra: z.coerce.number().min(0),
    ta: z.coerce.number().min(0),
    otherAllowance: z.coerce.number().min(0),
});

export type OfferLetterFormValues = z.infer<typeof offerLetterSchema>;
