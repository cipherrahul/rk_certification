"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Loader2, Pencil, MapPin, Phone, BookOpen, GraduationCap, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeacherIDCard } from "./TeacherIDCard";
import { TeacherForm } from "./TeacherForm";
import { SalaryManagement } from "./SalaryManagement";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Teacher {
    id: string;
    teacher_id: string;
    name: string;
    branch: string;
    department: string;
    assigned_class: string;
    subject: string;
    qualification: string;
    experience: string;
    contact: string;
    joining_date: string;
    basic_salary: number;
    allowances: number;
    photo_url: string | null;
    created_at: string;
}

interface SalaryRecord {
    id: string;
    slip_number: string;
    month: string;
    year: number;
    basic_salary: number;
    allowances: number;
    deductions: number;
    net_salary: number;
    payment_status: string;
    payment_date: string | null;
    slip_notes: string | null;
    created_at: string;
}

interface TeacherProfileProps {
    teacher: Teacher;
    salaryRecords: SalaryRecord[];
}

export function TeacherProfile({ teacher, salaryRecords }: TeacherProfileProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEditing = searchParams?.get("edit") === "true";
    const cardRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownloadIDCard = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [340, 210] });
            pdf.addImage(imgData, "PNG", 0, 0, 340, 210);
            pdf.save(`IDCard-${teacher.teacher_id}-${teacher.name.replace(/\s+/g, "_")}.pdf`);
        } catch (e) {
            console.error("ID Card PDF generation failed:", e);
        }
        setDownloading(false);
    };

    if (isEditing) {
        return (
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Link href={`/admin/teachers/${teacher.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Teacher</h1>
                        <p className="text-sm text-muted-foreground">{teacher.teacher_id} • {teacher.name}</p>
                    </div>
                </div>
                <TeacherForm
                    mode="edit"
                    teacherId={teacher.id}
                    defaultValues={{
                        name: teacher.name,
                        branch: teacher.branch,
                        department: teacher.department,
                        assignedClass: teacher.assigned_class,
                        subject: teacher.subject,
                        qualification: teacher.qualification,
                        experience: teacher.experience,
                        contact: teacher.contact,
                        joiningDate: new Date(teacher.joining_date),
                        basicSalary: teacher.basic_salary,
                        allowances: teacher.allowances,
                    }}
                />
            </div>
        );
    }

    const netSalary = Number(teacher.basic_salary) + Number(teacher.allowances);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/teachers">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{teacher.name}</h1>
                        <p className="text-sm text-muted-foreground">{teacher.teacher_id} • {teacher.department}</p>
                    </div>
                </div>
                <Link href={`/admin/teachers/${teacher.id}?edit=true`}>
                    <Button variant="outline" className="gap-2">
                        <Pencil className="w-4 h-4" /> Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: ID card + quick stats */}
                <div className="space-y-4">
                    {/* ID Card Preview */}
                    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Faculty ID Card</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-3">
                            <TeacherIDCard ref={cardRef} teacher={teacher} />
                            <Button
                                onClick={handleDownloadIDCard}
                                disabled={downloading}
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 text-xs"
                            >
                                {downloading
                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                                    : <><Download className="w-3.5 h-3.5" /> Download ID Card (PDF)</>}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick info */}
                    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4 space-y-3">
                            {[
                                { icon: GraduationCap, label: "Qualification", value: teacher.qualification },
                                { icon: Briefcase, label: "Experience", value: teacher.experience },
                                { icon: BookOpen, label: "Subject", value: teacher.subject },
                                { icon: Phone, label: "Contact", value: teacher.contact },
                                { icon: MapPin, label: "Class Assigned", value: teacher.assigned_class },
                                { icon: Calendar, label: "Joining Date", value: new Date(teacher.joining_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400">{label}</div>
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right column: salary overview + management */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Salary overview cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                            <CardContent className="p-4">
                                <div className="text-xs text-slate-500 mb-1">Basic Salary</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    ₹{Number(teacher.basic_salary).toLocaleString("en-IN")}
                                </div>
                                <Badge variant="outline" className="text-xs mt-2 bg-blue-50 text-blue-700 border-blue-200">
                                    Per Month
                                </Badge>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                            <CardContent className="p-4">
                                <div className="text-xs text-slate-500 mb-1">Net Salary (Gross)</div>
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    ₹{netSalary.toLocaleString("en-IN")}
                                </div>
                                <div className="text-xs text-slate-400 mt-2">
                                    + ₹{Number(teacher.allowances).toLocaleString("en-IN")} allowances
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Salary management */}
                    <SalaryManagement teacher={teacher} initialRecords={salaryRecords} />
                </div>
            </div>
        </div>
    );
}
