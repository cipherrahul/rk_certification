"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ClipboardList, Loader2, Link as LinkIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAssignments, createAssignment, deleteAssignment, getAssignmentSubmissions, gradeAssignmentSubmission } from "@/app/actions/learning";
import { getAllCoursesAction } from "@/lib/actions/course.action";

export default function AdminAssignmentsPage() {
    const { toast } = useToast();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [courseId, setCourseId] = useState("");
    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [maxMarks, setMaxMarks] = useState("100");
    const [attachmentUrl, setAttachmentUrl] = useState("");

    // Modal/Submissions View State
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [assignRes, coursesRes] = await Promise.all([
                getAssignments(),
                getAllCoursesAction()
            ]);
            setAssignments(assignRes || []);
            if (coursesRes.success) setCourses(coursesRes.data || []);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        if (!courseId || !subject || !title || !dueDate) {
            toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            await createAssignment({
                course_id: courseId,
                subject,
                title,
                description,
                due_date: new Date(dueDate).toISOString(),
                max_marks: parseInt(maxMarks),
                attachment_url: attachmentUrl
            });
            toast({ title: "Success", description: "Assignment created successfully" });
            setTitle("");
            setDescription("");
            setAttachmentUrl("");
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to create assignment", variant: "destructive" });
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this assignment and all its submissions?")) return;
        try {
            await deleteAssignment(id);
            if (selectedAssignment?.id === id) setSelectedAssignment(null);
            toast({ title: "Success", description: "Assignment deleted successfully" });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete", variant: "destructive" });
        }
    };

    const viewSubmissions = async (assignment: any) => {
        setSelectedAssignment(assignment);
        setLoadingSubmissions(true);
        try {
            const subs = await getAssignmentSubmissions(assignment.id);
            setSubmissions(subs || []);
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to load submissions", variant: "destructive" });
        }
        setLoadingSubmissions(false);
    };

    const handleGrade = async (subId: string, marks: number) => {
        try {
            await gradeAssignmentSubmission(subId, marks);
            toast({ title: "Success", description: "Submission graded" });
            // refresh submissions
            if (selectedAssignment) viewSubmissions(selectedAssignment);
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to grade", variant: "destructive" });
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Assignments</h1>
                <p className="text-muted-foreground text-sm font-medium">Create assignments and grade student submissions.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <Card className="lg:col-span-1 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Create Assignment</CardTitle>
                        <CardDescription>Assign tasks to students.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Course</label>
                            <Select value={courseId} onValueChange={setCourseId}>
                                <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                            <Input placeholder="e.g. Mathematics" value={subject} onChange={e => setSubject(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                            <Input placeholder="e.g. Differentiation Problems" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Instructions/Description</label>
                            <Input placeholder="What to do..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Due Date & Time</label>
                                <Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Max Marks</label>
                                <Input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Attachment Link (Optional)</label>
                            <Input placeholder="PDF Link, Drive URL..." value={attachmentUrl} onChange={e => setAttachmentUrl(e.target.value)} />
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4" onClick={handleCreate} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Create Assignment
                        </Button>
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* List */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b border-border/40">
                            <CardTitle className="text-lg">Active Assignments</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /></div>
                            ) : assignments.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="pl-6">Assignment</TableHead>
                                            <TableHead>Deadline</TableHead>
                                            <TableHead>Marks</TableHead>
                                            <TableHead className="text-right pr-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assignments.map((ast) => (
                                            <TableRow key={ast.id} className={selectedAssignment?.id === ast.id ? "bg-indigo-50/50" : ""}>
                                                <TableCell className="pl-6">
                                                    <div className="font-bold text-gray-900">{ast.title}</div>
                                                    <div className="text-xs font-medium text-indigo-600 mb-1">{ast.courses?.name} - {ast.subject}</div>
                                                    {ast.attachment_url && (
                                                        <a href={ast.attachment_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                                                            <LinkIcon className="w-3 h-3 mr-1" /> View Attachment
                                                        </a>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium">
                                                        {new Date(ast.due_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-rose-500 font-semibold">
                                                        {new Date(ast.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-slate-50">{ast.max_marks} Pts</Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 space-x-2">
                                                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200" onClick={() => viewSubmissions(ast)}>
                                                        <Users className="w-4 h-4 mr-2" />
                                                        Submissions
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-rose-500 h-9 w-9 p-0" onClick={() => handleDelete(ast.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">
                                    <ClipboardList className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                    No assignments created yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submissions Details (Appears when clicking "Submissions" above) */}
                    {selectedAssignment && (
                        <Card className="shadow-sm border-indigo-100 ring-1 ring-indigo-50">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
                                <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Submissions: {selectedAssignment.title}
                                </CardTitle>
                                <CardDescription>Review and grade student work.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loadingSubmissions ? (
                                    <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /></div>
                                ) : submissions.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50 border-y">
                                                <TableHead className="pl-6">Student</TableHead>
                                                <TableHead>Submitted At</TableHead>
                                                <TableHead>Work Link</TableHead>
                                                <TableHead>Status / Score</TableHead>
                                                <TableHead className="text-right pr-6">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions.map((sub) => (
                                                <TableRow key={sub.id}>
                                                    <TableCell className="pl-6">
                                                        <div className="font-bold text-gray-900">{sub.students?.first_name} {sub.students?.last_name}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">{sub.students?.student_id}</div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {new Date(sub.submitted_at).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <a href={sub.submission_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                                            <LinkIcon className="w-4 h-4 mr-1" /> View Work
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>
                                                        {sub.status === 'Graded' ? (
                                                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                                                {sub.marks_obtained} / {selectedAssignment.max_marks} Pts
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        {sub.status !== 'Graded' && (
                                                            <Button
                                                                size="sm"
                                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                                onClick={() => {
                                                                    const marks = prompt(`Enter marks out of ${selectedAssignment.max_marks}:`);
                                                                    if (marks && !isNaN(parseInt(marks))) {
                                                                        handleGrade(sub.id, parseInt(marks));
                                                                    }
                                                                }}
                                                            >
                                                                Grade
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        No submissions yet for this assignment.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
