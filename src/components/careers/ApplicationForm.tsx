"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationFormSchema, ApplicationFormValues } from "@/lib/schemas/application";
import { submitApplicationAction } from "@/lib/actions/application.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, Upload, AlertCircle, FileText } from "lucide-react";
// Removed static Job import

interface ApplicationFormProps {
    job: {
        id: string;
        title: string;
    };
}

const RESUME_SIZE_LIMIT_KB = 50;
const RESUME_SIZE_LIMIT_BYTES = RESUME_SIZE_LIMIT_KB * 1024;

export default function ApplicationForm({ job }: ApplicationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeError, setResumeError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationFormSchema),
        defaultValues: {
            jobId: job.id,
            jobTitle: job.title,
            termsAccepted: false,
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setResumeError(null);
        if (!file) {
            setResumeFile(null);
            return;
        }
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowedTypes.includes(file.type)) {
            setResumeError("Only PDF or DOC/DOCX files are accepted.");
            setResumeFile(null);
            return;
        }
        if (file.size > RESUME_SIZE_LIMIT_BYTES) {
            setResumeError(`Resume size must not exceed ${RESUME_SIZE_LIMIT_KB}KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`);
            setResumeFile(null);
            return;
        }
        setResumeFile(file);
    };

    const onSubmit = async (data: ApplicationFormValues) => {
        if (!resumeFile) {
            setResumeError("Please upload your resume to proceed.");
            return;
        }
        setIsSubmitting(true);
        setServerError(null);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(resumeFile);
            reader.onload = async () => {
                const base64String = (reader.result as string).split(",")[1];
                const result = await submitApplicationAction(data, base64String, resumeFile.name);
                if (result.success) {
                    setSubmitSuccess(true);
                } else {
                    setServerError(result.error || "An unexpected error occurred. Please try again.");
                }
                setIsSubmitting(false);
            };
        } catch {
            setServerError("Failed to process your application. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="text-center py-16 px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-3">Application Submitted!</h3>
                <p className="text-emerald-700 dark:text-emerald-400 text-lg mb-2">
                    Thank you for applying for <strong>{job.title}</strong> at RK Institution.
                </p>
                <p className="text-muted-foreground text-sm">Our team will review your application and reach out to you if your profile is shortlisted. The last date to apply is <strong>31 March 2026</strong>.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden fields */}
            <input type="hidden" {...register("jobId")} />
            <input type="hidden" {...register("jobTitle")} />

            {/* Personal Details */}
            <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">Personal Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input id="fullName" placeholder="e.g. Priya Sharma" {...register("fullName")} className="mt-1" />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className="mt-1" />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phone">Mobile Number *</Label>
                        <Input id="phone" type="tel" placeholder="10-digit mobile number" {...register("phone")} className="mt-1" />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="currentLocation">Current Location *</Label>
                        <Input id="currentLocation" placeholder="e.g. Delhi, Mumbai" {...register("currentLocation")} className="mt-1" />
                        {errors.currentLocation && <p className="text-xs text-red-500 mt-1">{errors.currentLocation.message}</p>}
                    </div>
                </div>
            </div>

            {/* Qualification & Experience */}
            <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">Qualification & Experience</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="highestQualification">Highest Qualification *</Label>
                        <Input id="highestQualification" placeholder="e.g. M.A. English, B.Ed." {...register("highestQualification")} className="mt-1" />
                        {errors.highestQualification && <p className="text-xs text-red-500 mt-1">{errors.highestQualification.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="experienceYears">Years of Experience *</Label>
                        <Select onValueChange={(val) => setValue("experienceYears", val)}>
                            <SelectTrigger id="experienceYears" className="mt-1">
                                <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                                <SelectItem value="0-1">Less than 1 year</SelectItem>
                                <SelectItem value="1-2">1–2 years</SelectItem>
                                <SelectItem value="2-5">2–5 years</SelectItem>
                                <SelectItem value="5+">5+ years</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.experienceYears && <p className="text-xs text-red-500 mt-1">{errors.experienceYears.message}</p>}
                    </div>
                </div>
            </div>

            {/* Cover Letter */}
            <div>
                <Label htmlFor="coverLetter">Cover Letter / Why should we hire you? *</Label>
                <Textarea
                    id="coverLetter"
                    rows={5}
                    placeholder="Tell us why you're perfect for this role, your relevant experience, and what you'll bring to RK Institution... (min. 50 characters)"
                    {...register("coverLetter")}
                    className="mt-1 resize-none"
                />
                {errors.coverLetter && <p className="text-xs text-red-500 mt-1">{errors.coverLetter.message}</p>}
            </div>

            {/* Resume Upload */}
            <div>
                <Label>Resume Upload * <span className="text-muted-foreground font-normal text-xs ml-1">(PDF or DOC/DOCX, Max 50KB)</span></Label>
                <div
                    className="mt-1 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {resumeFile ? (
                        <div className="flex items-center justify-center gap-3 text-emerald-600">
                            <FileText className="w-8 h-8" />
                            <div className="text-left">
                                <p className="font-semibold">{resumeFile.name}</p>
                                <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB — Click to change</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-500 dark:text-slate-400">
                            <Upload className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                            <p className="font-medium">Click to upload your resume</p>
                            <p className="text-xs mt-1">PDF or DOC · Maximum file size: <strong>50KB</strong></p>
                        </div>
                    )}
                </div>
                {resumeError && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {resumeError}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wider">Terms & Conditions</h4>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    By submitting this application, I confirm that: (1) All information provided is accurate and truthful to the best of my knowledge. (2) I understand that false or misleading information will lead to disqualification. (3) I authorise RK Institution to verify my credentials and contact my references if required. (4) Last date to apply is <strong>31 March 2026</strong>. Late submissions will not be accepted. (5) Submitting this form does not guarantee an interview or employment at RK Institution.
                </p>
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        className="mt-0.5 w-4 h-4 rounded accent-indigo-600"
                        onChange={(e) => setValue("termsAccepted", e.target.checked)}
                    />
                    <label htmlFor="termsAccepted" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed">
                        I have read and accept the terms and conditions. I confirm all the information provided is accurate.
                    </label>
                </div>
                {errors.termsAccepted && <p className="text-xs text-red-500 mt-2">{errors.termsAccepted.message}</p>}
            </div>

            {/* Server Error */}
            {serverError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{serverError}</p>
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
                {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Application...</>
                ) : (
                    <>Submit My Application</>
                )}
            </Button>
        </form>
    );
}
