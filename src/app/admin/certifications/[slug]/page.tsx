"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { certificateFormSchema, CertificateFormValues } from "@/lib/schemas/certificate";
import { cn } from "@/lib/utils";
import { createCertificateAction } from "@/lib/actions/certificate.action";
import { generateAndUploadCertificatePDF } from "@/lib/pdf/generate";
import { CertificateLayout } from "@/components/certificate/CertificateLayout";

export default function CertificateFormPage({ params }: { params: { slug: string } }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [currentData, setCurrentData] = useState<CertificateFormValues | null>(null);

    // Convert slug back to readable Title Case (basic conversion)
    const courseName = params.slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const form = useForm<CertificateFormValues>({
        resolver: zodResolver(certificateFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            fatherName: "",
            email: "",
            mobile: "",
            courseName: courseName,
            grade: "",
            duration: "",
        },
    });

    // Update real-time data for layout
    form.watch((data) => {
        if (data) {
            // @ts-expect-error Type instantiation is excessively deep and possibly infinite
            setCurrentData(data as CertificateFormValues);
        }
    });

    async function onSubmit(data: CertificateFormValues) {
        setIsLoading(true);
        // Force state update to render layout correctly
        setCurrentData(data);

        try {
            // Small delay to ensure the layout has rendered with state
            await new Promise(resolve => setTimeout(resolve, 500));

            const fileName = `${data.firstName}-${data.lastName}-${data.courseName.replace(/\s+/g, '-')}-${Date.now()}`;
            const pdfUrl = await generateAndUploadCertificatePDF("certificate-template", fileName.toLowerCase());

            if (!pdfUrl) {
                toast({ title: "Warning", description: "PDF generation or upload failed. Storage bucket might lack RLS policy. Saving record without PDF.", variant: "destructive" });
            }

            const result = await createCertificateAction(data, pdfUrl || "");

            if (result.success) {
                toast({ title: "Success", description: `Certificate ${result.certificateId} generated and saved successfully!` });
                form.reset();
            } else {
                toast({ title: "Error", description: result.error || "Failed to create certificate record.", variant: "destructive" });
            }
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <CertificateLayout data={currentData} />
            <div className="container px-4 md:px-6 py-12 mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Generate Certificate</h1>
                    <p className="text-muted-foreground">Fill in the details below to generate a new certificate for <span className="font-semibold text-primary">{courseName}</span></p>
                </div>

                <div className="bg-card text-card-foreground shadow-sm border rounded-xl p-6 md:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fatherName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Father's Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Richard Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="courseName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course / Certification Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mobile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 234 567 8900" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="completionDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col pt-2">
                                            <FormLabel>Completion Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grade / Performance</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. A+, Distinction, 95%" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 6 Months, 120 Hours" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="photo"
                                    render={({ field: { onChange, value: _val, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Student Photo (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...fieldProps}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                onChange(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        } else {
                                                            onChange(undefined);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg mt-8" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Certificate"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
}
