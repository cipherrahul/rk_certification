import { z } from "zod";

export const teacherSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    branch: z.string().optional(),
    department: z.string().min(1, "Department is required"),
    assignedClass: z.string().min(1, "Assigned class is required"),
    subject: z.string().min(1, "Subject is required"),
    qualification: z.string().min(1, "Qualification is required"),
    experience: z.string().min(1, "Experience is required"),
    contact: z.string().min(10, "Contact must be at least 10 digits"),
    joiningDate: z.date(),
    basicSalary: z.coerce.number().min(0, "Basic salary must be non-negative"),
    allowances: z.coerce.number().min(0, "Allowances must be non-negative"),
    branchId: z.string().uuid("Invalid branch ID").optional(),
    role: z.enum(["Teacher", "Branch Head", "Staff"]).default("Teacher"),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;

