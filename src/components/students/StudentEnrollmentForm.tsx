"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createStudentAction, updateStudentAction } from "@/lib/actions/student.action";
import { getBranchesAction } from "@/lib/actions/branch.action";
import { getAllCoursesAction } from "@/lib/actions/course.action";
import { studentFormSchema, StudentFormValues } from "@/lib/schemas/student";

interface StudentEnrollmentFormProps {
    studentId?: string;
    initialData?: Partial<StudentFormValues> & { photo_url?: string };
}

export function StudentEnrollmentForm({ studentId, initialData }: StudentEnrollmentFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo_url || null);
    const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
    const [branches, setBranches] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const queryBranchId = searchParams.get("branchId");

    const form = useForm<StudentFormValues>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            fatherName: initialData?.fatherName || "",
            mobile: initialData?.mobile || "",
            course: initialData?.course || "",
            academicSession: initialData?.academicSession || "2026-27",
            studentClass: initialData?.studentClass || "",
            totalCourseFee: initialData?.totalCourseFee || 0,
            admissionFee: initialData?.admissionFee || 0,
            monthlyFeeAmount: initialData?.monthlyFeeAmount || 0,
            paymentMode: initialData?.paymentMode || "Cash",
            branchId: initialData?.branchId || queryBranchId || "",
            classId: initialData?.classId || "",
            paymentStartDate: initialData?.paymentStartDate ? new Date(initialData.paymentStartDate) : new Date(),
            dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : undefined,
        },
    });

    useEffect(() => {
        getBranchesAction().then(res => {
            if (res.success) setBranches(res.data);
        });
        getAllCoursesAction().then(res => {
            if (res.success) setCourses(res.data || []);
        });
    }, []);

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPhotoPreview(result);
            setPhotoBase64(result);
        };
        reader.readAsDataURL(file);
    }

    async function onSubmit(data: StudentFormValues) {
        setIsLoading(true);
        try {
            const result = studentId
                ? await updateStudentAction(studentId, data, photoBase64)
                : await createStudentAction(data, photoBase64);

            if (result.success) {
                toast({
                    title: studentId ? "Student Updated!" : "Student Enrolled!",
                    description: studentId
                        ? `Changes saved successfully.`
                        : `Student ID: ${(result as any).studentId} created successfully.`,
                });
                router.push(studentId ? `/admin/students/${studentId}` : "/admin/students");
                router.refresh();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {/* Basic Details Section */}
                <div className="space-y-6">
                    <div className="border-b pb-2">
                        <h2 className="text-xl font-bold tracking-tight">🧾 Basic Details</h2>
                        <p className="text-sm text-muted-foreground">Personal, academic, and contact information.</p>
                    </div>

                    <div className="flex flex-col items-center gap-3 mb-2">
                        <div className="w-28 h-28 rounded-full border-2 border-dashed border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center overflow-hidden">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-indigo-300" />
                            )}
                        </div>
                        <label className="cursor-pointer flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Rahul" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Kumar" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                                                disabled={(d) => d > new Date() || d < new Date("1900-01-01")} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="fatherName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Father's Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Ramesh Kumar" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl><Input placeholder="e.g. 9876543210" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="studentClass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student Class</FormLabel>
                                    <FormControl><Input placeholder="e.g. 10th, 12th, BCA" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="course"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courses.map((c) => (
                                                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="academicSession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Session</FormLabel>
                                    <FormControl><Input placeholder="e.g. 2026-27" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="branchId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || queryBranchId || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a branch" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {branches.map((b) => (
                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Fee Details Section */}
                <div className="space-y-6">
                    <div className="border-b pb-2">
                        <h2 className="text-xl font-bold tracking-tight">💰 Fee Details</h2>
                        <p className="text-sm text-muted-foreground">Course fees and payment setup.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="totalCourseFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Course Fee</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g. 15000" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="admissionFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admission Fee (If applicable)</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g. 2000" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="monthlyFeeAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Fee Amount</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g. 1200" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="paymentMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Mode</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="paymentStartDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col pt-2">
                                    <FormLabel>Payment Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {studentId ? "Saving Changes..." : "Enrolling Student..."}</>
                    ) : (
                        studentId ? "Save Changes" : "Enroll Student"
                    )}
                </Button>
            </form>
        </Form>
    );
}
