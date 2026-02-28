"use client";

import { useState } from "react";
import { Search, GraduationCap, ArrowRight, Loader2, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStudentResultsPublicAction } from "@/lib/actions/public.action";
import { ReportCardView } from "@/components/academic/ReportCardView";
import { DownloadReportCard } from "@/components/academic/DownloadReportCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PublicResultSearch() {
    const [studentId, setStudentId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{ student: any; results: any[] } | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId.trim()) return;

        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await getStudentResultsPublicAction(studentId);
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setError(res.error || "No records found for this Student ID.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Search Section */}
            <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    Secure Verification Portal
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Find Your Result</h2>
                <p className="text-muted-foreground text-sm font-medium">Enter your permanent Enrollment ID issued at the time of admission to access your digital records.</p>

                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
                    </div>
                    <Input
                        type="text"
                        placeholder="e.g. RK20260001"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="pl-12 h-14 text-lg font-black tracking-widest uppercase border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl shadow-xl transition-all"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !studentId.trim()}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <ArrowRight className="w-5 h-5" />
                        )}
                    </Button>
                </form>

                {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Section */}
            {data && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-2xl ring-4 ring-emerald-500/20">
                            <GraduationCap className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            {data.student.first_name} {data.student.last_name}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant="outline" className="font-mono bg-slate-50 border-slate-200 text-slate-600 px-3">
                                {data.student.student_id}
                            </Badge>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm font-bold text-slate-500 uppercase">{data.student.course}</span>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {data.results.length > 0 ? (
                            data.results.map((result) => (
                                <div key={result.id} className="space-y-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-xl gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 rounded-xl">
                                                <FileText className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tight">
                                                    {result.exams.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground font-bold">Session {result.exams.academic_session}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <Badge className={result.marks_obtained >= result.exams.passing_marks ? "bg-emerald-600" : "bg-rose-600"}>
                                                {result.marks_obtained >= result.exams.passing_marks ? "PASSED" : "FAILED"}
                                            </Badge>
                                            <DownloadReportCard resultId={result.id} />
                                        </div>
                                    </div>
                                    <ReportCardView
                                        exam={result.exams}
                                        student={data.student}
                                        marks={[result]}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-muted-foreground font-bold italic">No examination records published for your ID yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
