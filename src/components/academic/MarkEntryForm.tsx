"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, Trash2 } from "lucide-react";
import { recordMarksAction, deleteMarkAction } from "@/lib/actions/exam.action";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getSubjectsByCourseAction } from "@/lib/actions/subject.action";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Student {
    id: string;
    first_name: string;
    last_name: string;
    student_id: string;
}

interface MarkRecord {
    studentId: string;
    marksObtained: number;
    isAbsent: boolean;
    remarks: string;
}

interface Exam {
    id: string;
    title: string;
    course: string;
    total_marks: number;
    passing_marks: number;
}

interface MarkEntryFormProps {
    exam: Exam;
    students: Student[];
    initialMarks: any[];
}

export function MarkEntryForm({ exam, students, initialMarks }: MarkEntryFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("Final");
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

    useEffect(() => {
        async function fetchSubjects() {
            setIsLoadingSubjects(true);
            const res = await getSubjectsByCourseAction(exam.course);
            if (res.success && res.data && res.data.length > 0) {
                setSubjects(res.data);
                setSelectedSubject(res.data[0].name);
            }
            setIsLoadingSubjects(false);
        }
        fetchSubjects();
    }, [exam.course]);
    const [marks, setMarks] = useState<Record<string, MarkRecord>>(() => {
        const initialMap: Record<string, MarkRecord> = {};
        students.forEach(s => {
            const existing = initialMarks.find(m => m.student_id === s.id);
            initialMap[s.id] = {
                studentId: s.id,
                marksObtained: existing ? Number(existing.marks_obtained) : 0,
                isAbsent: existing ? existing.is_absent : false,
                remarks: existing ? existing.remarks || "" : "",
            };
        });
        return initialMap;
    });

    const handleMarkChange = (studentId: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        if (numValue > exam.total_marks) return;
        setMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], marksObtained: numValue }
        }));
    };

    const handleAbsentChange = (studentId: string, checked: boolean) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], isAbsent: checked, marksObtained: checked ? 0 : prev[studentId].marksObtained }
        }));
    };

    const handleRemarksChange = (studentId: string, value: string) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks: value }
        }));
    };

    const handleDelete = async (studentId: string) => {
        if (!confirm("Are you sure you want to delete this mark record? This action cannot be undone.")) return;

        try {
            const res = await deleteMarkAction(exam.id, studentId, selectedSubject);
            if (res.success) {
                setMarks(prev => ({
                    ...prev,
                    [studentId]: {
                        studentId,
                        marksObtained: 0,
                        isAbsent: false,
                        remarks: ""
                    }
                }));
                alert("Mark deleted successfully");
            } else {
                alert(res.error || "Failed to delete mark");
            }
        } catch (err: any) {
            alert(err.message || "An unexpected error occurred");
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = Object.values(marks).map(m => ({
                examId: exam.id,
                studentId: m.studentId,
                subjectName: selectedSubject,
                marksObtained: m.marksObtained,
                isAbsent: m.isAbsent,
                remarks: m.remarks,
            }));

            const res = await recordMarksAction(payload);
            if (res.success) {
                toast({ title: "Success", description: "Marks recorded successfully!" });
                router.refresh();
            } else {
                toast({ title: "Error", description: res.error || "Failed to save marks", variant: "destructive" });
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "An unexpected error occurred", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="shadow-sm border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg">Student Mark Entry</CardTitle>
                        <CardDescription>
                            Enter marks for all students enrolled in <span className="font-semibold text-foreground">{exam.course}</span>.
                            Max marks: <span className="font-bold text-foreground">{exam.total_marks}</span>.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isLoadingSubjects && subjects.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">Subject:</span>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger className="w-[180px] h-9 bg-background border-brand/20">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => (
                                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="bg-brand hover:bg-brand/90 transition-all shadow-md"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            {isSubmitting ? "Saving Marks..." : "Save All Marks"}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-accent/30">
                            <TableRow className="border-border/40 hover:bg-transparent">
                                <TableHead className="pl-6">Student Info</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead className="w-[150px]">Marks Obtained</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                                <TableHead className="pr-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length > 0 ? students.map((student) => {
                                const studentMark = marks[student.id];
                                if (!studentMark) return null;

                                const percentage = ((studentMark.marksObtained / exam.total_marks) * 100).toFixed(1);
                                const isPassing = studentMark.marksObtained >= exam.passing_marks;

                                return (
                                    <TableRow key={student.id} className="border-border/40 hover:bg-accent/5 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground line-clamp-1">{student.first_name} {student.last_name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">{student.student_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`absent-${student.id}`}
                                                    checked={studentMark.isAbsent}
                                                    onCheckedChange={(checked) => handleAbsentChange(student.id, checked as boolean)}
                                                />
                                                <label
                                                    htmlFor={`absent-${student.id}`}
                                                    className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
                                                >
                                                    Absent
                                                </label>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={studentMark.marksObtained}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                disabled={studentMark.isAbsent}
                                                className={`h-9 font-bold bg-muted/30 focus:bg-background transition-colors ${!isPassing && !studentMark.isAbsent ? "text-red-500 border-red-200" : ""}`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {studentMark.isAbsent ? (
                                                <span className="text-muted-foreground italic text-xs">N/A</span>
                                            ) : (
                                                <span className={isPassing ? "text-emerald-600" : "text-rose-600"}>
                                                    {percentage}%
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {studentMark.isAbsent ? (
                                                <Badge variant="outline" className="bg-slate-100/50 text-slate-600 border-none px-2 py-0">ABSENT</Badge>
                                            ) : isPassing ? (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-0">PASS</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-2 py-0">FAIL</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Notes..."
                                                value={studentMark.remarks}
                                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                className="h-8 text-xs border-transparent hover:border-border transition-all"
                                            />
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(student.id)}
                                                className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                                        No students found matching this exam's criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
