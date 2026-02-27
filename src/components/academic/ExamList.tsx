import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Calendar, ClipboardList, GraduationCap } from "lucide-react";
import Link from "next/link";

export function ExamList({ exams }: { exams: any[] }) {
    if (!exams || exams.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground text-sm">
                No exams scheduled yet.
            </div>
        );
    }

    return (
        <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Marks (Total/Pass)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {exams.map((exam) => (
                    <TableRow key={exam.id}>
                        <TableCell className="font-medium text-foreground">{exam.title}</TableCell>
                        <TableCell className="text-sm">{exam.course}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="font-normal">
                                {exam.branches?.name || "All Branches"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(exam.exam_date).toLocaleDateString("en-IN")}
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm font-semibold">{exam.total_marks}</span>
                            <span className="text-xs text-muted-foreground mx-1">/</span>
                            <span className="text-sm text-emerald-600 font-medium">{exam.passing_marks}</span>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Link href={`/admin/academic/exams/${exam.id}/marks`}>
                                    <Button variant="outline" size="sm" className="h-8 shadow-sm">
                                        <ClipboardList className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                                        Enter Marks
                                    </Button>
                                </Link>
                                <Link href={`/admin/academic/exams/${exam.id}/report-cards`}>
                                    <Button variant="ghost" size="sm" className="h-8 text-slate-600 dark:text-slate-400 hover:text-brand">
                                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                                        Report Cards
                                    </Button>
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
