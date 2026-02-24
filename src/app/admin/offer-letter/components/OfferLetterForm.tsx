"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Download, CheckCircle2, FileText } from "lucide-react";

import { offerLetterSchema, type OfferLetterFormValues } from "@/lib/schemas/offer-letter.schema";
import { createOfferLetterAction } from "@/lib/actions/offer-letter.action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Field({ label, error, children, required }: {
    label: string; error?: string; children: React.ReactNode; required?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
                {label} {required && <span className="text-brand">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="pb-2 mb-1 border-b border-border/60">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
    );
}

export function OfferLetterForm() {
    const { toast } = useToast();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<OfferLetterFormValues>({
        resolver: zodResolver(offerLetterSchema),
        defaultValues: { hra: 0, ta: 0, otherAllowance: 0 },
    });

    const basic = watch("basicSalary") || 0;
    const hra = watch("hra") || 0;
    const ta = watch("ta") || 0;
    const other = watch("otherAllowance") || 0;
    const gross = Number(basic) + Number(hra) + Number(ta) + Number(other);

    async function onSubmit(data: OfferLetterFormValues) {
        const result = await createOfferLetterAction(data);
        if (result.success && result.pdfUrl) {
            setPdfUrl(result.pdfUrl);
            toast({ title: "Offer letter generated!", description: "PDF is ready to download." });
        } else {
            toast({ title: "Generation failed", description: result.error, variant: "destructive" });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Success Banner */}
            {pdfUrl && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-brand/30 bg-brand/10">
                    <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-brand">Offer Letter Generated Successfully!</p>
                        <p className="text-xs text-muted-foreground mt-0.5">The secured PDF is ready. Click to download.</p>
                    </div>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="outline" size="sm" className="border-brand text-brand hover:bg-brand/10">
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Download PDF
                        </Button>
                    </a>
                </div>
            )}

            {/* Personal Information */}
            <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        <SectionHeader title="Personal Information" description="Employee personal and contact details" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" error={errors.fullName?.message} required>
                        <Input placeholder="e.g. Ramesh Kumar" className="bg-background border-border/60 focus-visible:ring-brand" {...register("fullName")} />
                    </Field>
                    <Field label="Father's Name" error={errors.fatherName?.message} required>
                        <Input placeholder="e.g. Suresh Kumar" className="bg-background border-border/60 focus-visible:ring-brand" {...register("fatherName")} />
                    </Field>
                    <Field label="Employee Email" error={errors.employeeEmail?.message} required>
                        <Input type="email" placeholder="employee@example.com" className="bg-background border-border/60 focus-visible:ring-brand" {...register("employeeEmail")} />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Residential Address" error={errors.address?.message} required>
                            <Textarea rows={2} placeholder="Full residential address" className="bg-background border-border/60 focus-visible:ring-brand resize-none" {...register("address")} />
                        </Field>
                    </div>
                </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        <SectionHeader title="Job Details" description="Role, department, and work arrangement" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Position / Designation" error={errors.position?.message} required>
                        <Input placeholder="e.g. Senior Teacher" className="bg-background border-border/60 focus-visible:ring-brand" {...register("position")} />
                    </Field>
                    <Field label="Department" error={errors.department?.message} required>
                        <Input placeholder="e.g. Science & Mathematics" className="bg-background border-border/60 focus-visible:ring-brand" {...register("department")} />
                    </Field>
                    <Field label="Work Location" error={errors.workLocation?.message} required>
                        <Input placeholder="e.g. Adarsh Nagar, Delhi" className="bg-background border-border/60 focus-visible:ring-brand" {...register("workLocation")} />
                    </Field>
                    <Field label="Employment Type" error={errors.employmentType?.message} required>
                        <Select onValueChange={(v) => setValue("employmentType", v as OfferLetterFormValues["employmentType"], { shouldValidate: true })}>
                            <SelectTrigger className="bg-background border-border/60 focus:ring-brand">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {["Full-Time", "Part-Time", "Contract", "Internship"].map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        <SectionHeader title="Schedule & Probation" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Joining Date" error={errors.joiningDate?.message} required>
                        <Input type="date" className="bg-background border-border/60 focus-visible:ring-brand" {...register("joiningDate")} />
                    </Field>
                    <Field label="Probation Period" error={errors.probationPeriod?.message} required>
                        <Select onValueChange={(v) => setValue("probationPeriod", v, { shouldValidate: true })}>
                            <SelectTrigger className="bg-background border-border/60 focus:ring-brand">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                {["1 Month", "2 Months", "3 Months", "6 Months"].map((p) => (
                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Working Hours" error={errors.workingHours?.message} required>
                        <Select onValueChange={(v) => setValue("workingHours", v, { shouldValidate: true })}>
                            <SelectTrigger className="bg-background border-border/60 focus:ring-brand">
                                <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                            <SelectContent>
                                {["8 Hours/Day (Mon–Sat)", "6 Hours/Day (Mon–Sat)", "9 AM – 5 PM (Mon–Fri)", "Flexible Hours"].map((h) => (
                                    <SelectItem key={h} value={h}>{h}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </CardContent>
            </Card>

            {/* Salary */}
            <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        <SectionHeader title="Salary Structure" description="Monthly amounts in INR (₹)" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Basic Salary (₹)" error={errors.basicSalary?.message} required>
                            <Input type="number" min={0} placeholder="e.g. 25000" className="bg-background border-border/60 focus-visible:ring-brand" {...register("basicSalary")} />
                        </Field>
                        <Field label="HRA (₹)" error={errors.hra?.message}>
                            <Input type="number" min={0} placeholder="e.g. 8000" className="bg-background border-border/60 focus-visible:ring-brand" {...register("hra")} />
                        </Field>
                        <Field label="Travel Allowance – TA (₹)" error={errors.ta?.message}>
                            <Input type="number" min={0} placeholder="e.g. 2000" className="bg-background border-border/60 focus-visible:ring-brand" {...register("ta")} />
                        </Field>
                        <Field label="Other Allowances (₹)" error={errors.otherAllowance?.message}>
                            <Input type="number" min={0} placeholder="e.g. 1500" className="bg-background border-border/60 focus-visible:ring-brand" {...register("otherAllowance")} />
                        </Field>
                    </div>

                    {/* Gross Salary Display */}
                    <div className="flex items-center justify-between rounded-lg border border-brand/30 bg-brand/10 px-5 py-3">
                        <span className="text-sm font-semibold text-foreground">Gross Salary (CTC) / Month</span>
                        <span className="text-lg font-bold text-brand">
                            ₹{gross.toLocaleString("en-IN")}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Annual CTC: ₹{(gross * 12).toLocaleString("en-IN")}</p>
                </CardContent>
            </Card>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold text-sm transition-all duration-200"
            >
                {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Offer Letter...</>
                ) : (
                    <><FileText className="w-4 h-4 mr-2" /> Generate Offer Letter PDF</>
                )}
            </Button>
        </form>
    );
}
