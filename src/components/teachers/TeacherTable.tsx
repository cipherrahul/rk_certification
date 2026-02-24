"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Eye, Pencil, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { deleteTeacherAction } from "@/lib/actions/teacher.action";
import Link from "next/link";

interface Teacher {
    id: string;
    teacher_id: string;
    name: string;
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

interface TeacherTableProps {
    teachers: Teacher[];
}

export function TeacherTable({ teachers: initialTeachers }: TeacherTableProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [teachers, setTeachers] = useState(initialTeachers);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filtered = teachers.filter((t) => {
        const s = search.toLowerCase();
        return !s
            || t.name.toLowerCase().includes(s)
            || t.teacher_id.toLowerCase().includes(s)
            || t.subject.toLowerCase().includes(s)
            || t.department.toLowerCase().includes(s)
            || t.assigned_class.toLowerCase().includes(s);
    });

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete teacher "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        const result = await deleteTeacherAction(id);
        if (result.success) {
            setTeachers((prev) => prev.filter((t) => t.id !== id));
        } else {
            alert(result.error || "Failed to delete teacher.");
        }
        setDeletingId(null);
    };

    return (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg">Faculty Directory</CardTitle>
                        <CardDescription>
                            {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, ID, subject…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            />
                        </div>
                        <Link href="/admin/teachers/new">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Teacher
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/20">
                        <TableRow className="border-slate-100 dark:border-slate-800/50">
                            <TableHead className="pl-6 font-semibold text-slate-600">Teacher ID</TableHead>
                            <TableHead className="font-semibold text-slate-600">Name</TableHead>
                            <TableHead className="font-semibold text-slate-600">Department</TableHead>
                            <TableHead className="font-semibold text-slate-600">Class Assigned</TableHead>
                            <TableHead className="font-semibold text-slate-600">Subject</TableHead>
                            <TableHead className="font-semibold text-slate-600">Experience</TableHead>
                            <TableHead className="font-semibold text-slate-600">Net Salary</TableHead>
                            <TableHead className="text-right pr-6 font-semibold text-slate-600">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length > 0 ? (
                            filtered.map((teacher) => (
                                <TableRow
                                    key={teacher.id}
                                    className="border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                >
                                    <TableCell className="pl-6 font-mono text-xs font-medium text-slate-500">
                                        {teacher.teacher_id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {teacher.photo_url ? (
                                                <img
                                                    src={teacher.photo_url}
                                                    alt={teacher.name}
                                                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {teacher.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="font-medium text-slate-900 dark:text-slate-100">{teacher.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800">
                                            {teacher.department}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                        {teacher.assigned_class}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                        {teacher.subject}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {teacher.experience}
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        ₹{(Number(teacher.basic_salary) + Number(teacher.allowances)).toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-1">
                                            <Link href={`/admin/teachers/${teacher.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" title="View Profile">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/teachers/${teacher.id}?edit=true`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                title="Delete"
                                                disabled={deletingId === teacher.id}
                                                onClick={() => handleDelete(teacher.id, teacher.name)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <UserCog className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
                                        <p className="text-sm font-medium">
                                            {search ? "No teachers found matching your search" : "No teachers registered yet"}
                                        </p>
                                        {!search && (
                                            <Link href="/admin/teachers/new" className="mt-2">
                                                <Button size="sm" variant="outline" className="mt-1">
                                                    <Plus className="w-3 h-3 mr-1" /> Add First Teacher
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
