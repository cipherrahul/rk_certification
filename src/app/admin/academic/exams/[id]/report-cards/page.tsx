import { getExamByIdAction, getExamResultsAction } from "@/lib/actions/exam.action";
import { ReportCardView } from "@/components/academic/ReportCardView";
import { DownloadReportCard } from "@/components/academic/DownloadReportCard";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

export default async function ExamReportCardsPage({ params }: { params: { id: string } }) {
    const [examRes, resultsRes] = await Promise.all([
        getExamByIdAction(params.id),
        getExamResultsAction(params.id),
    ]);

    if (!examRes.success || !examRes.data) notFound();

    const exam = examRes.data;
    const results = resultsRes.success && resultsRes.data ? resultsRes.data : [];

    return (
        <div className="container px-4 py-8 mx-auto max-w-6xl space-y-8">
            <Link href="/admin/academic">
                <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Exams
                </Button>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Examination Report Cards</h1>
                    <p className="text-muted-foreground text-sm">Preview and download professional report cards for all students.</p>
                </div>
            </div>

            <div className="space-y-12">
                {results.length > 0 ? (
                    results.map((result: any) => (
                        <div key={result.id} className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-md uppercase text-center">
                                        {result.students.first_name[0]}{result.students.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{result.students.first_name} {result.students.last_name}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono tracking-widest">{result.students.student_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={Number(result.marks_obtained) >= exam.total_marks * 0.33 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}>
                                        {Number(result.marks_obtained) >= exam.total_marks * 0.33 ? "PASSED" : "FAILED"}
                                    </Badge>
                                    <DownloadReportCard resultId={result.id} />
                                </div>
                            </div>
                            <ReportCardView
                                exam={exam}
                                student={result.students}
                                marks={[result]}
                            />
                        </div>
                    ))
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="py-24 text-center text-muted-foreground italic flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white not-italic">No results found</p>
                                <p className="text-xs">Please enter marks for students to generate report cards.</p>
                            </div>
                            <Link href={`/admin/academic/exams/${params.id}/marks`}>
                                <Button variant="outline" size="sm">Go to Mark Entry</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
