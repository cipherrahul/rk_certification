import { getExamByIdAction, getStudentsForExamAction, getExamResultsAction } from "@/lib/actions/exam.action";
import { MarkEntryForm } from "@/components/academic/MarkEntryForm";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function ExamMarksPage({ params }: { params: { id: string } }) {
    const [examRes, resultsRes] = await Promise.all([
        getExamByIdAction(params.id),
        getExamResultsAction(params.id),
    ]);

    if (!examRes.success || !examRes.data) notFound();

    const exam = examRes.data;
    const initialMarks = resultsRes.success && resultsRes.data ? resultsRes.data : [];

    // Fetch students for this exam's course and branch
    const studentsRes = await getStudentsForExamAction(exam.course, exam.branch_id);
    const students = studentsRes.success ? (studentsRes.data as any[]) : [];

    return (
        <div className="container px-4 py-8 mx-auto max-w-6xl space-y-8">
            <Link href="/admin/academic">
                <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Exams
                </Button>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand font-bold uppercase tracking-wider text-xs">
                        <BookOpen className="w-3.5 h-3.5" />
                        Academic Result Entry
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{exam.title}</h1>
                    <p className="text-muted-foreground text-sm">
                        Course: <span className="font-semibold text-foreground">{exam.course}</span> |
                        Session: <span className="font-semibold text-foreground">{exam.academic_session}</span>
                    </p>
                </div>
            </div>

            <MarkEntryForm
                exam={exam}
                students={students || []}
                initialMarks={initialMarks}
            />
        </div>
    );
}
