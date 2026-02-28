"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteStudentAction, updateStudentPasswordAction } from "@/lib/actions/student.action";
import { useToast } from "@/hooks/use-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFeeStatus(student: any) {
    const payments = student.fee_payments || [];
    if (payments.length === 0) return "No Records";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const due = payments.reduce((sum: number, p: any) => sum + Number(p.remaining_amount), 0);
    if (due <= 0) return "Paid";
    return "Pending";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StudentTable({ students }: { students: any[] }) {
    const [search, setSearch] = useState("");
    const [feeFilter, setFeeFilter] = useState("All");
    const { toast } = useToast();

    const handleSetPassword = async (studentId: string, studentName: string) => {
        const newPassword = prompt(`Enter new password for ${studentName}:`);
        if (!newPassword) return;

        try {
            const res = await updateStudentPasswordAction(studentId, newPassword);
            if (res.success) {
                toast({ title: "Success", description: "Password updated successfully." });
            } else {
                toast({ title: "Error", description: res.error || "Failed to update password", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Unexpected error occurred.", variant: "destructive" });
        }
    };

    const filteredStudents = students.filter((student) => {
        // Search filter
        const s = search.toLowerCase();
        const matchesSearch =
            student.first_name.toLowerCase().includes(s) ||
            student.last_name.toLowerCase().includes(s) ||
            student.student_id.toLowerCase().includes(s) ||
            student.mobile.includes(s);

        // Fee status filter
        if (!matchesSearch) return false;

        if (feeFilter === "All") return true;

        const status = getFeeStatus(student);
        if (feeFilter === "Paid" && status === "Paid") return true;
        if (feeFilter === "Pending" && status === "Pending") return true;
        if (feeFilter === "No Records" && status === "No Records") return true;

        return false;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search students by name, ID, or mobile..."
                        className="pl-8 bg-white dark:bg-slate-950"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={feeFilter} onValueChange={setFeeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-950">
                        <SelectValue placeholder="Fee Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="No Records">No Records</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Session</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Fee Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents && filteredStudents.length > 0 ? (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            filteredStudents.map((student: any) => {
                                const status = getFeeStatus(student);
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono text-xs font-medium">{student.student_id}</TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                {student.photo_url ? (
                                                    <img src={student.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                                        {student.first_name[0]}
                                                    </div>
                                                )}
                                                {student.first_name} {student.last_name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{student.course}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{student.academic_session}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{student.mobile}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    status === "Paid"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                        : status === "Pending"
                                                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400"
                                                            : "bg-slate-50 text-slate-600 border-slate-200"
                                                }
                                            >
                                                {status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/students/${student.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8">View</Button>
                                                </Link>
                                                <Link href={`/admin/students/${student.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600">
                                                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-600"
                                                    onClick={() => handleSetPassword(student.id, student.first_name)}
                                                >
                                                    <Key className="w-3.5 h-3.5 mr-1" /> Password
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-600"
                                                    onClick={async () => {
                                                        if (confirm(`Are you sure you want to delete ${student.first_name}? This will remove all records including fees.`)) {
                                                            const res = await deleteStudentAction(student.id);
                                                            if (res.success) {
                                                                location.reload();
                                                            } else {
                                                                alert(res.error);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No students found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
