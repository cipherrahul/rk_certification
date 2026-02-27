"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Phone, Mail, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
    exam: any;
    student: any;
    marks: any[];
}

export function ReportCardView({ exam, student, marks }: ReportCardProps) {
    const branch = exam.branches;

    // Fallback branch details if not provided
    const branchAddress = branch?.address || "A-9 Adarsh Nagar, Delhi 110033";
    const branchContact = branch?.contact_number || "+91 7533042633";
    const branchEmail = branch?.email || "info@rkinstitution.com";

    // Since we are handling one exam result per card for now
    // We treat the "marks" array as subjects if available, or just the single exam entry
    const totalObtained = marks.reduce((sum, m) => sum + Number(m.marks_obtained), 0);
    const percentage = ((totalObtained / exam.total_marks) * 100).toFixed(1);
    const resultStatus = totalObtained >= exam.passing_marks ? "PASSED" : "FAILED";

    return (
        <Card className="w-full max-w-[1000px] mx-auto bg-white dark:bg-slate-950 border-2 border-slate-900 shadow-xl overflow-hidden print:shadow-none print:border-slate-300">
            {/* Header */}
            <div className="relative p-8 border-b-2 border-slate-900 overflow-hidden">
                {/* Background Watermark Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none rotate-[-15deg] scale-150 select-none flex flex-wrap gap-12 p-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} className="text-4xl font-black whitespace-nowrap">RK INSTITUTION</span>
                    ))}
                </div>

                <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                            <GraduationCap className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">RK Institution</h1>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400 mt-1 uppercase">Academic Excellence & Innovation</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2 text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                            {branchAddress}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                            {branchContact}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                            {branchEmail}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Title Strip */}
            <div className="bg-slate-900 text-white py-3 px-8 flex justify-between items-center">
                <span className="text-xs font-black tracking-widest uppercase">Statement of Academic Performance</span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest">Session: {exam.academic_session}</span>
            </div>

            <CardContent className="p-8 space-y-8">
                {/* Student Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Student Name</p>
                        <p className="text-base font-black text-slate-900 dark:text-white uppercase leading-tight">{student.first_name} {student.last_name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Enrollment ID</p>
                        <p className="text-base font-mono font-bold text-slate-900 dark:text-white leading-tight">{student.student_id}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Course / Program</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white uppercase leading-tight line-clamp-1">{exam.course}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Examination</p>
                        <p className="text-base font-bold text-slate-900 dark:text-white uppercase leading-tight">{exam.title}</p>
                    </div>
                </div>

                {/* Performance Table */}
                <div className="border-2 border-slate-900 rounded-xl overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-900">
                            <TableRow className="hover:bg-slate-900">
                                <TableHead className="text-white font-black uppercase tracking-widest h-12 pl-6">Subject / Assessment</TableHead>
                                <TableHead className="text-white font-black uppercase tracking-widest h-12 text-center w-32">Max Marks</TableHead>
                                <TableHead className="text-white font-black uppercase tracking-widest h-12 text-center w-32">Min Pass</TableHead>
                                <TableHead className="text-white font-black uppercase tracking-widest h-12 text-center w-32">Obtained</TableHead>
                                <TableHead className="text-white font-black uppercase tracking-widest h-12 text-center pr-6 w-32">Result</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {marks.map((m, idx) => (
                                <TableRow key={idx} className="border-b-2 border-slate-100 last:border-0 h-14 hover:bg-transparent">
                                    <TableCell className="pl-6 font-bold text-slate-900 dark:text-white uppercase text-sm">
                                        {m.subject_name === "Final" ? exam.title : m.subject_name}
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-bold">{exam.total_marks}</TableCell>
                                    <TableCell className="text-center font-mono text-slate-500">{exam.passing_marks}</TableCell>
                                    <TableCell className="text-center font-black text-lg text-slate-900 dark:text-white">
                                        {m.is_absent ? (
                                            <span className="text-rose-600">ABS</span>
                                        ) : (
                                            Number(m.marks_obtained).toFixed(0)
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center pr-6">
                                        {m.is_absent ? (
                                            <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none font-black text-[10px]">ABSENT</Badge>
                                        ) : (
                                            <Badge className={cn(
                                                "font-black text-[10px] px-3 py-0.5",
                                                Number(m.marks_obtained) >= exam.passing_marks ? "bg-emerald-600" : "bg-rose-600"
                                            )}>
                                                {Number(m.marks_obtained) >= exam.passing_marks ? "PASS" : "FAIL"}
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Final Summary Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    <div className="space-y-4 md:col-span-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-900 text-white rounded-xl text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Aggregate Marks</p>
                                <p className="text-2xl font-black">{totalObtained} / {exam.total_marks}</p>
                            </div>
                            <div className="p-4 border-2 border-slate-900 rounded-xl text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Percentage</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{percentage}%</p>
                            </div>
                            <div className="p-4 border-2 border-slate-900 rounded-xl text-center bg-slate-50 dark:bg-slate-900">
                                <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Final Status</p>
                                <p className={cn("text-2xl font-black", resultStatus === "PASSED" ? "text-emerald-600" : "text-rose-600")}>
                                    {resultStatus}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border-t-4 border-slate-900 shadow-sm bg-slate-50 dark:bg-slate-900/30">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Remarks & Performance Note</p>
                            <p className="text-sm italic text-slate-700 dark:text-slate-300">
                                {marks[0]?.remarks || "The student has demonstrated professional competency in the subject matter. Keep up the consistent performance."}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between items-center md:items-end text-center md:text-right space-y-8 pr-4">
                        <div className="text-center">
                            <div className="w-56 h-20 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center italic text-[10px] text-slate-400">
                                [Examination Controller Seal]
                            </div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white mt-3 uppercase tracking-widest">Authorized Signature</p>
                            <p className="text-[8px] text-slate-500 font-bold uppercase">RK Institution Administrative HQ</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-slate-400">Issued On: {new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <p className="text-[9px] font-bold text-slate-500 italic max-w-[200px]">Secure Digital Document. Unauthorized modification is strictly prohibited.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
