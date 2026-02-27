"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createSubjectAction, getAllSubjectsAction, deleteSubjectAction } from "@/lib/actions/subject.action";
import { getAllCoursesAction } from "@/lib/actions/course.action";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function SubjectManagementPage() {
    const { toast } = useToast();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newName, setNewName] = useState("");
    const [newCourse, setNewCourse] = useState("");

    const fetchSubjects = async () => {
        setIsLoading(true);
        const res = await getAllSubjectsAction();
        if (res.success) {
            setSubjects(res.data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSubjects();
        getAllCoursesAction().then(res => {
            if (res.success) setCourses(res.data || []);
        });
    }, []);

    const handleAddSubject = async () => {
        if (!newName || !newCourse) {
            toast({ title: "Validation Error", description: "Please provide both subject name and course", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        const res = await createSubjectAction({ name: newName, course: newCourse });
        if (res.success) {
            setNewName("");
            toast({ title: "Success", description: "Subject mapping added successfully" });
            fetchSubjects();
        } else {
            toast({ title: "Error", description: res.error || "Failed to add subject", variant: "destructive" });
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const res = await deleteSubjectAction(id);
        if (res.success) {
            toast({ title: "Success", description: "Subject mapping deleted successfully" });
            fetchSubjects();
        } else {
            toast({ title: "Error", description: res.error || "Failed to delete subject", variant: "destructive" });
        }
    };

    return (
        <div className="container px-4 py-8 mx-auto max-w-5xl space-y-8">
            <Link href="/admin/academic">
                <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Academic
                </Button>
            </Link>

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Subject Management</h1>
                <p className="text-muted-foreground text-sm font-medium">Link subjects to specific courses for automated mark entry.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Add Subject Card */}
                <Card className="md:col-span-1 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Subject</CardTitle>
                        <CardDescription>Define a new subject-course mapping.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject Name</label>
                            <Input
                                placeholder="e.g. MS Word"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Course</label>
                            <Select onValueChange={setNewCourse} value={newCourse}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose course..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="w-full bg-brand hover:bg-brand/90 font-bold"
                            onClick={handleAddSubject}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Mapping
                        </Button>
                    </CardContent>
                </Card>

                {/* Subjects List */}
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="text-lg">Existing Mappings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                                Loading subjects...
                            </div>
                        ) : subjects.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6">Subject Name</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead className="text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subjects.map((sub) => (
                                        <TableRow key={sub.id}>
                                            <TableCell className="pl-6 font-bold">{sub.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-50 text-slate-700 font-medium">
                                                    {sub.course}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                                    onClick={() => handleDelete(sub.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <BookOpen className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                No subjects mapped yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
