import { z } from "zod";

export const COURSES = [
  "Internship Completion Certificate",
  "Industrial Training Certificate",
  "Digital Marketing Certification",
  "Data Science Certification",
  "Data Structures & Algorithms Certification",
  "Cloud Computing",
  "Android App Development",
  "Ethical Hacking",
  "Programming",
  "Financial Accounting",
  "Web Designing",
  "AI/ML",
  "Full Stack Development",
  "Best Student of the Year",
  "Faculty of the Year",
  "Employee Experience Certificate",
] as const;

export const studentFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  course: z.string().min(2, "Course is required"),
  academicSession: z
    .string()
    .min(4, "Academic session is required")
    .regex(/^\d{4}-\d{2,4}$/, "Format must be e.g. 2026-27"),
  studentClass: z.string().min(1, "Student class is required"),
  totalCourseFee: z.number().min(0, "Invalid fee"),
  admissionFee: z.number().min(0, "Invalid fee"),
  monthlyFeeAmount: z.number().min(0, "Invalid fee"),
  paymentStartDate: z.date({ message: "Payment start date is required" }),
  paymentMode: z.string().min(2, "Payment mode is required"),
  photo: z.any().optional(),
  branchId: z.string().uuid("Invalid branch ID").optional(),
  classId: z.string().uuid("Invalid class ID").optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
