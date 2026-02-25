"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { JobInput, createJob, updateJob } from "@/lib/actions/jobs";
import { useToast } from "@/hooks/use-toast";

const jobSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    department: z.string().min(2, "Department is required"),
    location: z.string().min(2, "Location is required"),
    employment_type: z.string().min(1, "Employment type is required"),
    experience_required: z.string().min(1, "Experience is required"),
    salary_range: z.string().min(1, "Salary range is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.string().min(20, "Requirements must be at least 20 characters"),
    status: z.enum(["Draft", "Published"]),
});

interface JobFormProps {
    initialData?: JobInput & { id: string };
    isEditing?: boolean;
}

export function JobForm({ initialData, isEditing = false }: JobFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: initialData || {
            title: "",
            department: "",
            location: "Delhi (On-site)",
            employment_type: "Full-time",
            experience_required: "",
            salary_range: "",
            description: "",
            requirements: "",
            status: "Draft",
        },
    });

    async function onSubmit(values: z.infer<typeof jobSchema>) {
        setIsLoading(true);
        try {
            if (isEditing && initialData?.id) {
                await updateJob(initialData.id, values);
                toast({
                    title: "Job Updated",
                    description: "The job posting has been successfully updated.",
                });
            } else {
                await createJob(values as JobInput);
                toast({
                    title: "Job Created",
                    description: "The job posting has been successfully created.",
                });
            }
            router.push("/admin/jobs");
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Arts Teacher (11th & 12th)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Academics" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Delhi (On-site)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="employment_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employment Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="experience_required"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Experience Required</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 1-2 years" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="salary_range"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. ₹15,000 – ₹25,000/month" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Set status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Published jobs will be visible on the Careers page.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter detailed job description and about the role..."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Requirements & Qualifications</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter key requirements, qualifications, and skills..."
                                    className="min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-brand hover:bg-brand/90 text-white min-w-[120px]">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {form.getValues("status") === "Published" ? (
                                    <Send className="mr-2 h-4 w-4" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {isEditing ? "Update Job" : "Create Job"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
