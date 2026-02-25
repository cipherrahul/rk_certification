"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherSchema, TeacherFormValues } from "@/lib/schemas/teacher.schema";
import { createTeacherAction, updateTeacherAction } from "@/lib/actions/teacher.action";
import { getBranchesAction } from "@/lib/actions/branch.action";

// Fetched from database

const DEPARTMENTS = [
    "Science", "Commerce", "Arts", "Mathematics",
    "Languages", "Computer Science", "Physical Education",
    "Social Studies", "Vocational", "Administration"
];

const CLASSES = [
    "All Classes", "Class 1–5 (Primary)", "Class 6–8 (Middle)",
    "Class 9–10 (Secondary)", "Class 11–12 (Senior Secondary)",
    "Class 9", "Class 10", "Class 11 (Science)", "Class 11 (Commerce)",
    "Class 11 (Arts)", "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)"
];

interface TeacherFormProps {
    mode: "create" | "edit";
    teacherId?: string;
    defaultValues?: Partial<TeacherFormValues>;
}

export function TeacherForm({ mode, teacherId, defaultValues }: TeacherFormProps) {
    const router = useRouter();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [branches, setBranches] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const queryBranchId = searchParams.get("branchId");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TeacherFormValues>({
        // @ts-expect-error Zod config inferred types conflict with useForm output
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            department: defaultValues?.department || "",
            assignedClass: defaultValues?.assignedClass || "",
            subject: defaultValues?.subject || "",
            qualification: defaultValues?.qualification || "",
            experience: defaultValues?.experience || "",
            contact: defaultValues?.contact || "",
            joiningDate: defaultValues?.joiningDate || new Date(),
            basicSalary: defaultValues?.basicSalary || 0,
            allowances: defaultValues?.allowances || 0,
            branchId: defaultValues?.branchId || queryBranchId || "",
            role: (defaultValues?.role as any) || "Teacher",
        },
    });

    useState(() => {
        getBranchesAction().then(res => {
            if (res.success) setBranches(res.data);
        });
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setPhotoPreview(result);
            setPhotoBase64(result);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: TeacherFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result =
                mode === "create"
                    ? await createTeacherAction(data, photoBase64 || undefined)
                    : await updateTeacherAction(teacherId!, data, photoBase64 || undefined);

            if (result.success) {
                router.push("/admin/teachers");
                router.refresh();
            } else {
                setError(result.error || "Operation failed.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 max-w-4xl mx-auto">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Photo Upload */}
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 lg:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Profile Photo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-3">
                        <div
                            className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-slate-400">
                                    <Camera className="w-7 h-7" />
                                    <span className="text-xs">Upload Photo</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs"
                        >
                            {photoPreview ? "Change Photo" : "Choose Photo"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Personal Info */}
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Rajesh Kumar Sharma"
                                {...register("name")}
                                className="mt-1"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="contact">Contact Number *</Label>
                            <Input
                                id="contact"
                                placeholder="e.g. 9876543210"
                                {...register("contact")}
                                className="mt-1"
                            />
                            {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="joiningDate">Joining Date *</Label>
                            <Input
                                id="joiningDate"
                                type="date"
                                className="mt-1"
                                defaultValue={defaultValues?.joiningDate
                                    ? new Date(defaultValues.joiningDate).toISOString().split("T")[0]
                                    : new Date().toISOString().split("T")[0]}
                                onChange={(e) => setValue("joiningDate", new Date(e.target.value), { shouldValidate: true })}
                            />
                            {errors.joiningDate && <p className="text-xs text-red-500 mt-1">{errors.joiningDate.message}</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Academic Info */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Academic Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <Label>Branch *</Label>
                        <Select
                            defaultValue={watch("branchId") || queryBranchId || ""}
                            onValueChange={(v) => {
                                setValue("branchId", v, { shouldValidate: true });
                                const branchName = branches.find(b => b.id === v)?.name;
                                if (branchName) setValue("branch", branchName);
                            }}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.branchId && <p className="text-xs text-red-500 mt-1">{errors.branchId.message}</p>}
                    </div>

                    <div>
                        <Label>Department *</Label>
                        <Select
                            defaultValue={defaultValues?.department}
                            onValueChange={(v) => setValue("department", v, { shouldValidate: true })}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {DEPARTMENTS.map((d) => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
                    </div>

                    <div>
                        <Label>Class Assigned *</Label>
                        <Select
                            defaultValue={defaultValues?.assignedClass}
                            onValueChange={(v) => setValue("assignedClass", v, { shouldValidate: true })}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                {CLASSES.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.assignedClass && <p className="text-xs text-red-500 mt-1">{errors.assignedClass.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                            id="subject"
                            placeholder="e.g. Mathematics, Physics"
                            {...register("subject")}
                            className="mt-1"
                        />
                        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="qualification">Qualification *</Label>
                        <Input
                            id="qualification"
                            placeholder="e.g. M.Sc., B.Ed., M.A."
                            {...register("qualification")}
                            className="mt-1"
                        />
                        {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="experience">Experience *</Label>
                        <Input
                            id="experience"
                            placeholder="e.g. 5 Years, 10+ Years"
                            {...register("experience")}
                            className="mt-1"
                        />
                        {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Salary Info */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Salary Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="basicSalary">Basic Salary (₹) *</Label>
                        <Input
                            id="basicSalary"
                            type="number"
                            min={0}
                            placeholder="e.g. 30000"
                            {...register("basicSalary")}
                            className="mt-1"
                        />
                        {errors.basicSalary && <p className="text-xs text-red-500 mt-1">{errors.basicSalary.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="allowances">Allowances (₹)</Label>
                        <Input
                            id="allowances"
                            type="number"
                            min={0}
                            placeholder="e.g. 5000"
                            {...register("allowances")}
                            className="mt-1"
                        />
                        {errors.allowances && <p className="text-xs text-red-500 mt-1">{errors.allowances.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-6">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> {mode === "create" ? "Create Teacher" : "Save Changes"}</>
                    )}
                </Button>
            </div>
        </form>
    );
}
