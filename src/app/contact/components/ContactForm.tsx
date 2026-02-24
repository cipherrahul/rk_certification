"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Send } from "lucide-react";

import { enquiryFormSchema, type EnquiryFormValues } from "@/lib/schemas/enquiry";
import { submitEnquiryAction } from "@/lib/actions/enquiry.action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const classOptions = [
    "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
];

const courseOptions = [
    "General Education", "Science Stream", "Commerce Stream", "Arts Stream",
    "Computer Science", "Vocational Training", "Diploma Course", "Other",
];

export function ContactForm() {
    const { toast } = useToast();
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EnquiryFormValues>({
        resolver: zodResolver(enquiryFormSchema),
    });

    async function onSubmit(data: EnquiryFormValues) {
        const result = await submitEnquiryAction(data);

        if (result.success) {
            setIsSuccess(true);
            reset();
            toast({
                title: "Enquiry submitted successfully!",
                description: "We will contact you within 24 hours.",
            });
            setTimeout(() => setIsSuccess(false), 4000);
        } else {
            toast({
                title: "Submission failed",
                description: result.error ?? "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="rounded-xl border border-border/60 bg-card p-6 md:p-8 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Parent Enquiry Form</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Fill in the details below and we&apos;ll get back to you shortly.
                </p>
            </div>

            {isSuccess && (
                <div className="flex items-center gap-3 rounded-lg border border-brand/30 bg-brand/10 p-4 mb-6 text-brand">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                        Thank you! Your enquiry has been submitted. We&apos;ll reach out to you soon.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Row 1: Student Name & Parent Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="studentName" className="text-sm font-medium">
                            Student Name <span className="text-brand">*</span>
                        </Label>
                        <Input
                            id="studentName"
                            placeholder="Enter student's full name"
                            className="bg-background border-border/60 focus-visible:ring-brand"
                            {...register("studentName")}
                        />
                        {errors.studentName && (
                            <p className="text-xs text-destructive">{errors.studentName.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="parentName" className="text-sm font-medium">
                            Parent / Guardian Name <span className="text-brand">*</span>
                        </Label>
                        <Input
                            id="parentName"
                            placeholder="Enter parent's full name"
                            className="bg-background border-border/60 focus-visible:ring-brand"
                            {...register("parentName")}
                        />
                        {errors.parentName && (
                            <p className="text-xs text-destructive">{errors.parentName.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Class & Course Interested */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                            Class <span className="text-brand">*</span>
                        </Label>
                        <Select onValueChange={(val) => setValue("class_", val, { shouldValidate: true })}>
                            <SelectTrigger className="bg-background border-border/60 focus:ring-brand">
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classOptions.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.class_ && (
                            <p className="text-xs text-destructive">{errors.class_.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                            Course Interested <span className="text-brand">*</span>
                        </Label>
                        <Select onValueChange={(val) => setValue("courseInterested", val, { shouldValidate: true })}>
                            <SelectTrigger className="bg-background border-border/60 focus:ring-brand">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courseOptions.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.courseInterested && (
                            <p className="text-xs text-destructive">{errors.courseInterested.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 3: Mobile & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="mobileNumber" className="text-sm font-medium">
                            Mobile Number <span className="text-brand">*</span>
                        </Label>
                        <Input
                            id="mobileNumber"
                            type="tel"
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className="bg-background border-border/60 focus-visible:ring-brand"
                            {...register("mobileNumber")}
                        />
                        {errors.mobileNumber && (
                            <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address <span className="text-brand">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="parent@example.com"
                            className="bg-background border-border/60 focus-visible:ring-brand"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-brand">*</span>
                    </Label>
                    <Textarea
                        id="message"
                        rows={4}
                        placeholder="Tell us about your child's needs, questions about admission, or any other enquiry..."
                        className="bg-background border-border/60 focus-visible:ring-brand resize-none"
                        {...register("message")}
                    />
                    {errors.message && (
                        <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-semibold h-11 transition-all duration-200"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Enquiry
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
