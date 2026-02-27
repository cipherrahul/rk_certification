"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, Loader2, ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { createCourseAction, getAllCoursesAction, deleteCourseAction } from "@/lib/actions/course.action";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function CourseManagementPage() {
    const { toast } = useToast();
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newName, setNewName] = useState("");
    const [newCode, setNewCode] = useState("");

    const fetchCourses = async () => {
        setIsLoading(true);
        const res = await getAllCoursesAction();
        if (res.success) {
            setCourses(res.data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAddCourse = async () => {
        if (!newName) {
            toast({ title: "Validation Error", description: "Please provide course name", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        const res = await createCourseAction({ name: newName, code: newCode });
        if (res.success) {
            setNewName("");
            setNewCode("");
            toast({ title: "Success", description: "Course added successfully" });
            fetchCourses();
        } else {
            toast({ title: "Error", description: res.error || "Failed to add course", variant: "destructive" });
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect existing programs and subjects linked to this course name.")) return;
        const res = await deleteCourseAction(id);
        if (res.success) {
            toast({ title: "Success", description: "Course deleted successfully" });
            fetchCourses();
        } else {
            toast({ title: "Error", description: res.error || "Failed to delete course", variant: "destructive" });
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
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Universal Courses</h1>
                <p className="text-muted-foreground text-sm font-medium">Manage course names that will be visible across the entire institution.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Add Course Card */}
                <Card className="md:col-span-1 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Course</CardTitle>
                        <CardDescription>Register a new universal course name.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Course Name</label>
                            <Input
                                placeholder="e.g. DCA, ADCA, Tally"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Course Code (Optional)</label>
                            <Input
                                placeholder="e.g. DCA01"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold text-white"
                            onClick={handleAddCourse}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Course
                        </Button>
                    </CardContent>
                </Card>

                {/* Courses List */}
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="text-lg">Universal Course List</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                                Loading courses...
                            </div>
                        ) : courses.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6">Course Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead className="text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="pl-6 font-bold">{course.name}</TableCell>
                                            <TableCell>
                                                {course.code ? (
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 font-medium">
                                                        {course.code}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                                    onClick={() => handleDelete(course.id)}
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
                                <GraduationCap className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                No courses registered yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
